import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingCart, Check, SearchX, X, Archive, Search } from 'lucide-react'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'
import { searchProducts, getBrands, getCategoryFilters } from '@/features/catalog/api/catalog'
import { CATEGORIES } from '@/config/categories'
import { useCart } from '@/stores/CartContext'
import { formatPrice } from '@/utils/currency'

const ITEMS_PER_PAGE = 15

const CATEGORY_META = {
  CPU: { title: 'Processors (CPU)', desc: 'Central processing units for your build' },
  GPU: { title: 'Graphics Cards (GPU)', desc: 'High-performance computational rendering engines' },
  Motherboard: { title: 'Motherboards', desc: 'The foundation of your PC build' },
  Memory: { title: 'Memory (RAM)', desc: 'High-speed system memory modules' },
  'Internal Drive': { title: 'Storage (SSD/NVMe)', desc: 'Fast solid-state storage solutions' },
  'CPU Cooler': { title: 'CPU Coolers', desc: 'Thermal management solutions for processors' },
  Case: { title: 'PC Cases', desc: 'Chassis and enclosures for your components' },
  PSU: { title: 'Power Supplies', desc: 'Reliable power delivery units' },
}

const SPEC_MAP = {
  CPU: [
    { label: 'CORES / THREADS', key: 'core_count', fmt: (v, s) => `${v || '?'} / ${s.thread_count || '?'}` },
    { label: 'BOOST CLOCK', key: 'boost_clock' },
    { label: 'TDP', key: 'tdp' },
    { label: 'SOCKET', key: 'socket' },
  ],
  GPU: [
    { label: 'VRAM', key: 'memory' },
    { label: 'CORE CLOCK', key: 'core_clock' },
    { label: 'TDP', key: 'tdp' },
    { label: 'CHIPSET', key: 'chipset' },
  ],
  Motherboard: [
    { label: 'SOCKET', key: 'socket' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'MEMORY TYPE', key: 'memory_type' },
    { label: 'M.2 SLOTS', key: 'm2_slots' },
  ],
  Memory: [
    { label: 'SPEED', key: 'speed' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'MODULES', key: 'modules' },
    { label: 'CAS LATENCY', key: 'cas_latency' },
  ],
  'Internal Drive': [
    { label: 'CAPACITY', key: 'capacity' },
    { label: 'TYPE', key: 'type' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'INTERFACE', key: 'interface' },
  ],
  PSU: [
    { label: 'WATTAGE', key: 'wattage' },
    { label: 'EFFICIENCY', key: 'efficiency' },
    { label: 'MODULAR', key: 'modular' },
    { label: 'TYPE', key: 'type' },
  ],
  Case: [
    { label: 'TYPE', key: 'type' },
    { label: 'MOTHERBOARD', key: 'motherboard_form_factor' },
    { label: 'MAX GPU LENGTH', key: 'max_gpu_length' },
    { label: 'INCLUDED FANS', key: 'included_fans' },
  ],
  'CPU Cooler': [
    { label: 'FAN RPM', key: 'fan_rpm' },
    { label: 'HEIGHT', key: 'height' },
    { label: 'SOCKET', key: 'cpu_socket' },
    { label: 'NOISE LEVEL', key: 'noise_level' },
  ],
}

function getFirstImage(urls) {
  if (!urls) return null
  try {
    const parsed = JSON.parse(urls)
    return Array.isArray(parsed) ? parsed[0] : null
  } catch {
    return urls || null
  }
}

function getSpecsForProduct(product) {
  const map = SPEC_MAP[product.table_name]
  if (!map) return []
  return map.map((spec) => ({
    label: spec.label,
    value: spec.fmt ? spec.fmt(product.specs[spec.key], product.specs) : (product.specs[spec.key] || 'N/A'),
  }))
}

function StockBadge({ stock }) {
  if (stock == null) return null
  const color = stock > 5 ? 'bg-green-600' : stock > 0 ? 'bg-amber-500' : 'bg-red-600'
  const label = stock > 5 ? 'In Stock' : stock > 0 ? `Low: ${stock}` : 'Out of Stock'
  return <span className={`${color} text-white font-label text-[10px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm whitespace-nowrap`}>{label}</span>
}

function CategoryMenuBar({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-8 py-3 bg-surface-container border-b border-outline/10">
      {CATEGORIES.map((cat) => {
        const active = selected === cat
        return (
          <button
            key={cat}
            onClick={() => onSelect(active ? null : cat)}
            className={`w-full whitespace-nowrap font-label text-[11px] tracking-[0.15em] uppercase px-4 py-2 transition-all ${
              active
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-primary hover:bg-primary/5 border border-outline/20'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

function CheckboxFilterGroup({ label, values, selected, onChange }) {
  return (
    <div className="mb-6">
      <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-3">{label}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {values.map((v) => (
          <label key={v} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected === v}
              onChange={() => onChange(selected === v ? null : v)}
              className="h-3.5 w-3.5 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30 focus:ring-offset-0 transition-colors"
            />
            <span className="font-label text-[11px] text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">{v}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function RangeFilterGroup({ label, min, max, valueMin, valueMax, onMinChange, onMaxChange }) {
  return (
    <div className="mb-6">
      <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-3">{label}</h3>
      <div className="flex items-center gap-2">
        <input
          className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={min || 'MIN'}
          type="text"
          value={valueMin}
          onChange={onMinChange}
        />
        <span className="text-on-surface-variant/30 font-label text-[10px]">-</span>
        <input
          className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
          placeholder={max || 'MAX'}
          type="text"
          value={valueMax}
          onChange={onMaxChange}
        />
      </div>
    </div>
  )
}

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || null)
  const [selectedManufacturer, setSelectedManufacturer] = useState(() => searchParams.get('manufacturer') || null)
  const [priceMin, setPriceMin] = useState(() => searchParams.get('price_min') || '')
  const [priceMax, setPriceMax] = useState(() => searchParams.get('price_max') || '')
  const [checkboxFilters, setCheckboxFilters] = useState({})
  const [rangeFilters, setRangeFilters] = useState({})
  const [brands, setBrands] = useState({})
  const [categoryFilterOptions, setCategoryFilterOptions] = useState(null)
  const [compareIds, setCompareIds] = useState(() => {
    const pre = searchParams.get('compare')
    return pre ? new Set([pre]) : new Set()
  })

  const { addCatalogItem } = useCart()
  const [addedIds, setAddedIds] = useState(new Set())

  useEffect(() => {
    getBrands().then(setBrands).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      getCategoryFilters(selectedCategory).then(setCategoryFilterOptions).catch(() => setCategoryFilterOptions(null))
    } else {
      setCategoryFilterOptions(null)
    }
  }, [selectedCategory])

  const parseFiltersForApi = useCallback(() => {
    const apiFilters = {}
    for (const [col, val] of Object.entries(checkboxFilters)) {
      if (val != null) {
        apiFilters[col] = val
      }
    }
    for (const [col, val] of Object.entries(rangeFilters)) {
      const rangeVal = {}
      if (val.min !== '' && val.min != null) rangeVal.min = val.min
      if (val.max !== '' && val.max != null) rangeVal.max = val.max
      if (Object.keys(rangeVal).length > 0) {
        apiFilters[col] = rangeVal
      }
    }
    return Object.keys(apiFilters).length > 0 ? apiFilters : null
  }, [checkboxFilters, rangeFilters])

  const activeFilters = []
  if (searchQuery) activeFilters.push({ label: `Search: "${searchQuery}"`, onRemove: () => setSearchQuery('') })
  if (selectedManufacturer) activeFilters.push({ label: `Brand: ${selectedManufacturer}`, onRemove: () => setSelectedManufacturer(null) })
  if (priceMin || priceMax) activeFilters.push({ label: `Price: ${priceMin || '0'} - ${priceMax || '∞'}`, onRemove: () => { setPriceMin(''); setPriceMax('') } })
  for (const [col, val] of Object.entries(checkboxFilters)) {
    if (val != null) {
      const label = categoryFilterOptions?.checkbox?.[col]?.label || col
      activeFilters.push({ label: `${label}: ${val}`, onRemove: () => setCheckboxFilters(prev => ({ ...prev, [col]: null })) })
    }
  }
  for (const [col, val] of Object.entries(rangeFilters)) {
    if ((val.min !== '' && val.min != null) || (val.max !== '' && val.max != null)) {
      const label = categoryFilterOptions?.range?.[col]?.label || col
      activeFilters.push({ label: `${label}: ${val.min || '0'} - ${val.max || '∞'}`, onRemove: () => setRangeFilters(prev => ({ ...prev, [col]: { min: '', max: '' } })) })
    }
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addCatalogItem(product, product.table_name)
    setAddedIds(prev => new Set(prev).add(`${product.table_name}-${product.id}`))
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev)
        next.delete(`${product.table_name}-${product.id}`)
        return next
      })
    }, 2000)
  }

  const meta = selectedCategory ? CATEGORY_META[selectedCategory] : null
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apiFilters = parseFiltersForApi()
      const res = await searchProducts({
        q: searchQuery,
        category: selectedCategory,
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        sort_by: sortBy,
        in_stock_first: true,
        manufacturer: selectedManufacturer || undefined,
        price_min: priceMin ? parseFloat(priceMin) : undefined,
        price_max: priceMax ? parseFloat(priceMax) : undefined,
        filters: apiFilters,
      })
      setProducts(res.results || [])
      setCount(res.count || 0)
    } catch (err) {
      setError(err.message || 'Failed to load products')
      setProducts([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory, sortBy, selectedManufacturer, priceMin, priceMax, searchQuery, parseFiltersForApi])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, sortBy, selectedManufacturer, priceMin, priceMax, searchQuery, checkboxFilters, rangeFilters])

  const clearAllFilters = () => {
    setSelectedManufacturer(null)
    setPriceMin('')
    setPriceMax('')
    setSearchQuery('')
    setCheckboxFilters({})
    setRangeFilters({})
    const next = new URLSearchParams()
    if (selectedCategory) next.set('category', selectedCategory)
    setSearchParams(next)
  }

  const updateSearchParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value == null || value === '' || value === false) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const handleCategoryChange = (cat) => {
    const next = selectedCategory === cat ? null : cat
    setSelectedCategory(next)
    setCheckboxFilters({})
    setRangeFilters({})
    setCurrentPage(1)
    updateSearchParam('category', next)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    updateSearchParam('q', searchQuery)
  }

  const handleManufacturerChange = (mfr) => {
    setSelectedManufacturer(mfr)
    updateSearchParam('manufacturer', mfr)
  }

  const handlePriceMinChange = (e) => {
    setPriceMin(e.target.value)
    updateSearchParam('price_min', e.target.value)
  }

  const handlePriceMaxChange = (e) => {
    setPriceMax(e.target.value)
    updateSearchParam('price_max', e.target.value)
  }

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const currentBrands = selectedCategory ? (brands[selectedCategory] || []) : []
  const specColumns = selectedCategory ? SPEC_MAP[selectedCategory] || [] : []
  const cfo = categoryFilterOptions

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Header />

      <CategoryMenuBar selected={selectedCategory} onSelect={handleCategoryChange} />

      {!selectedCategory ? (
        <main className="flex-grow flex flex-col items-center justify-center p-8 bg-surface-dim">
          <div className="text-center max-w-xl">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-2 block">{'>'} CATALOG</span>
            <h1 className="font-headline text-4xl md:text-5xl tracking-tight text-on-surface uppercase mb-4">Choose a Component Type</h1>
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-8">
              Select a category above to browse available products and compare specifications.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex-grow flex w-full max-w-[1920px] mx-auto">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 xl:w-80 bg-surface-container p-6 md:p-8 flex-shrink-0 min-h-[calc(100vh-80px)] overflow-y-auto`}>
            <div className="mb-8 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-label text-[10px] text-primary tracking-[0.2em]">{'>'}</span>
                <h2 className="font-label text-m tracking-[0.15em] uppercase text-on-surface">Filters</h2>
              </div>
              <p className="font-label text-[11px] text-on-surface-variant/60 uppercase tracking-wider">Narrow specifications</p>
            </div>

            {currentBrands.length > 0 && (
              <CheckboxFilterGroup
                label="Brand"
                values={currentBrands}
                selected={selectedManufacturer}
                onChange={handleManufacturerChange}
              />
            )}

            {cfo?.checkbox && Object.entries(cfo.checkbox).map(([col, filter]) => {
              if (col === 'manufacturer') return null
              const currentVal = checkboxFilters[col] || null
              return (
                <CheckboxFilterGroup
                  key={col}
                  label={filter.label}
                  values={filter.values}
                  selected={currentVal}
                  onChange={(v) => setCheckboxFilters(prev => ({ ...prev, [col]: v }))}
                />
              )
            })}

            <div className="mb-6">
              <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-3">Price (RM)</h3>
              <div className="flex items-center gap-2">
                <input
                  className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="MIN"
                  type="number"
                  value={priceMin}
                  onChange={handlePriceMinChange}
                />
                <span className="text-on-surface-variant/30 font-label text-[10px]">-</span>
                <input
                  className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="MAX"
                  type="number"
                  value={priceMax}
                  onChange={handlePriceMaxChange}
                />
              </div>
            </div>

            {cfo?.range && Object.entries(cfo.range).map(([col, filter]) => {
              const currentVal = rangeFilters[col] || { min: '', max: '' }
              return (
                <RangeFilterGroup
                  key={col}
                  label={filter.label}
                  min={filter.min}
                  max={filter.max}
                  valueMin={currentVal.min}
                  valueMax={currentVal.max}
                  onMinChange={(e) => setRangeFilters(prev => ({ ...prev, [col]: { ...prev[col], min: e.target.value } }))}
                  onMaxChange={(e) => setRangeFilters(prev => ({ ...prev, [col]: { ...prev[col], max: e.target.value } }))}
                />
              )
            })}

            <div className="mb-6">
              <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-3">Availability</h3>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!rangeFilters._inStockOnly}
                  onChange={() => setRangeFilters(prev => ({ ...prev, _inStockOnly: !prev._inStockOnly ? 'true' : null }))}
                  className="h-3.5 w-3.5 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30 focus:ring-offset-0 transition-colors"
                />
                <span className="font-label text-[11px] text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">In Stock Only</span>
              </label>
            </div>
          </aside>

          <section className="flex-grow p-6 md:p-8 lg:p-12 bg-surface-dim min-w-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <div>
                <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-1 block">{'>'} CATALOG</span>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface uppercase">
                  {meta ? meta.title : 'ALL COMPONENTS'}
                </h1>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                  {meta ? meta.desc : 'Browse our complete component catalog'}
                </p>
              </div>
              <div className="flex items-center gap-3 self-end flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden font-label text-[10px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-3 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  FILTERS
                </button>
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-surface-container border border-outline/30 focus-within:border-primary/50 transition-colors">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-on-surface font-label text-[11px] px-3 py-2.5 w-40 md:w-48 focus:outline-none uppercase tracking-wider placeholder:text-on-surface-variant/40"
                  />
                  <button type="submit" className="px-2.5 text-on-surface-variant hover:text-primary transition-colors">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-surface-container border border-outline/30 text-on-surface font-label text-[11px] tracking-wider px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none pr-8 uppercase"
                >
                  <option value="default">DEFAULT</option>
                  <option value="price_asc">PRICE: LOW TO HIGH</option>
                  <option value="price_desc">PRICE: HIGH TO LOW</option>
                  <option value="name_asc">NAME: A-Z</option>
                  <option value="name_desc">NAME: Z-A</option>
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4 p-3 bg-surface-container-lowest">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mr-1">ACTIVE:</span>
                {activeFilters.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 font-label text-[10px] tracking-[0.1em] uppercase bg-primary/10 text-primary px-2 py-1">
                    {f.label}
                    <button onClick={f.onRemove} className="hover:text-on-surface transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button onClick={clearAllFilters} className="font-label text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-wider ml-1 underline underline-offset-2">
                  Clear All
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                {count} ITEMS FOUND
              </span>
              <button
                onClick={() => {
                  const ids = Array.from(compareIds)
                  const params = new URLSearchParams()
                  ids.forEach(id => params.append('ids', id))
                  window.open(`/compare?${params}`, '_blank')
                }}
                disabled={compareIds.size < 2}
                className={`font-label text-[11px] tracking-[0.15em] uppercase border px-3 py-1.5 transition-colors ${
                  compareIds.size >= 2
                    ? 'text-primary border-primary/30 hover:bg-primary/10'
                    : 'text-outline/40 border-outline/10 cursor-not-allowed'
                }`}
              >
                Compare ({compareIds.size})
              </button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-14 bg-surface-container animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <SearchX className="w-10 h-10 mx-auto mb-4 text-outline" />
                <span className="font-label text-[10px] tracking-[0.2em] text-red-400">{'>'} LOAD ERROR</span>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-3">{error}</p>
                <button onClick={loadProducts} className="mt-4 font-label text-xs text-primary hover:underline">
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Archive className="w-10 h-10 mx-auto mb-4 text-outline" />
                <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} NO PRODUCTS FOUND</span>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-3">No items match the current criteria.</p>
                {activeFilters.length > 0 && (
                  <button onClick={clearAllFilters} className="mt-4 font-label text-xs text-primary hover:underline">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline/20">
                        <th className="w-10 p-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">CMP</th>
                        <th className="p-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">Stock</th>
                        <th className="p-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">Product</th>
                        {specColumns.map(col => (
                          <th key={col.key} className="p-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase whitespace-nowrap">{col.label}</th>
                        ))}
                        <th className="p-3 font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase text-right">Price</th>
                        <th className="w-28 p-3"><span className="sr-only">Action</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const imageUrl = getFirstImage(product.image_urls)
                        const specs = getSpecsForProduct(product)
                        const prodId = `${product.table_name}-${product.id}`
                        return (
                          <tr key={prodId} className="border-b border-outline/10 hover:bg-surface-container-lowest/50 transition-colors group">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={compareIds.has(prodId)}
                                onChange={() => toggleCompare(prodId)}
                                className="h-4 w-4 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30"
                              />
                            </td>
                            <td className="p-3">
                              <StockBadge stock={product.stock} />
                            </td>
                            <td className="p-3">
                              <Link to={`/product/${product.table_name}/${product.id}`} className="flex items-center gap-3 group/link">
                                {imageUrl && (
                                  <div className="w-10 h-10 flex-shrink-0 bg-surface-container rounded-sm overflow-hidden">
                                    <img src={imageUrl} alt="" className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none' }} />
                                  </div>
                                )}
                                <div>
                                  <div className="font-label text-[11px] text-primary tracking-[0.15em] uppercase">{product.manufacturer || 'GENERIC'}</div>
                                  <div className="font-body text-sm text-on-surface group-hover/link:text-primary transition-colors">{product.name}</div>
                                </div>
                              </Link>
                            </td>
                            {specs.map(spec => (
                              <td key={spec.label} className="p-3 font-body text-xs text-on-surface-variant whitespace-nowrap">
                                {spec.value}
                              </td>
                            ))}
                            <td className="p-3 text-right font-headline text-base tracking-tight text-primary whitespace-nowrap">
                              {formatPrice(product.price)}
                            </td>
                            <td className="p-3">
                              {product.stock != null && product.stock > 0 ? (
                                <button
                                  onClick={(e) => handleAddToCart(e, product)}
                                  className={`w-full flex items-center justify-center gap-1.5 font-label text-[10px] tracking-[0.15em] uppercase px-2 py-1.5 rounded transition-all ${
                                    addedIds.has(prodId)
                                      ? 'bg-green-600 text-white'
                                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'
                                  }`}
                                >
                                  {addedIds.has(prodId) ? (
                                    <><Check className="w-3 h-3" /> ADDED</>
                                  ) : (
                                    <><ShoppingCart className="w-3 h-3" /> ADD</>
                                  )}
                                </button>
                              ) : (
                                <span className="block text-center font-label text-[10px] tracking-[0.15em] uppercase text-red-500">
                                  {product.stock != null ? 'OUT OF STOCK' : ''}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider order-2 md:order-1">
                      SHOWING {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, count)} OF {count} ITEMS
                    </span>
                    <div className="flex items-center gap-2 order-1 md:order-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 flex items-center justify-center border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {getPageNumbers().map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 flex items-center justify-center font-label text-xs tracking-wider transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-on-primary'
                              : 'border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50'
                          }`}
                        >
                          {String(page).padStart(2, '0')}
                        </button>
                      ))}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="w-9 h-9 flex items-center justify-center font-label text-xs text-on-surface-variant/40">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 flex items-center justify-center border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      )}

      <Footer />
    </div>
  )
}

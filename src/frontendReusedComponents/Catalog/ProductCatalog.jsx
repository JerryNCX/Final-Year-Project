import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingCart, Check } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { searchProducts } from '@/lib/api'
import { CATEGORIES } from '@/lib/categories'
import { useCart } from '@/lib/CartContext'
import { formatPrice } from '@/lib/currency'

const ITEMS_PER_PAGE = 12

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

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || null)
  const [manufacturers, setManufacturers] = useState([])
  const [selectedManufacturer, setSelectedManufacturer] = useState(null)

  const [inStockOnly, setInStockOnly] = useState(false)

  const { addCatalogItem } = useCart()
  const [addedIds, setAddedIds] = useState(new Set())

  const filteredProducts = inStockOnly
    ? products.filter(p => p.stock != null && p.stock > 0)
    : products

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
    try {
      const res = await searchProducts({
        q: '',
        category: selectedCategory,
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        sort_by: sortBy,
        in_stock_first: true,
      })
      setProducts(res.results || [])
      setCount(res.count || 0)
    } catch (err) {
      console.error('Failed to load products:', err)
      setProducts([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory, sortBy])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, sortBy])

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

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Header />

      <main className="flex-grow flex w-full max-w-[1920px] mx-auto">
        {/* Filter sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 xl:w-80 bg-surface-container p-6 md:p-8 flex-shrink-0 min-h-[calc(100vh-80px)]`}>
          <div className="mb-8 pb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label text-[10px] text-primary tracking-[0.2em]">{'>'}</span>
              <h2 className="font-label text-m tracking-[0.15em] uppercase text-on-surface">Filters</h2>
            </div>
            <p className="font-label text-[11px] text-on-surface-variant/60 uppercase tracking-wider">Narrow specifications</p>
          </div>

            <div className="mb-7">
            <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-4">COMPONENT TYPE</h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      const next = selectedCategory === cat ? null : cat
                      setSelectedCategory(next)
                      setSearchParams(next ? { category: next } : {})
                    }}
                    className="h-4 w-4 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30 focus:ring-offset-0 transition-colors"
                  />
                  <span className="font-label text-xs text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-7">
            <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-4">PRICE RANGE</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-label text-[10px]">RM</span>
                <input className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] pl-5 pr-2 py-2 focus:outline-none focus:border-primary/50 transition-colors" placeholder="MIN" type="number" />
              </div>
              <span className="text-on-surface-variant/30 font-label text-[10px]">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-label text-[10px]">RM</span>
                <input className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] pl-5 pr-2 py-2 focus:outline-none focus:border-primary/50 transition-colors" placeholder="MAX" type="number" />
              </div>
            </div>
          </div>

          <div className="mb-7">
            <h3 className="font-label text-sm tracking-[0.15em] uppercase text-primary mb-4">AVAILABILITY</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(prev => !prev)}
                className="h-4 w-4 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30 focus:ring-offset-0 transition-colors"
              />
              <span className="font-label text-xs text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-grow p-6 md:p-8 lg:p-12 bg-surface-dim">
          {/* Header bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-1 block">{'>'} CATALOG</span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface uppercase">
                {meta ? meta.title : 'ALL COMPONENTS'}
              </h1>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                {meta ? meta.desc : 'Browse our complete component catalog'}
              </p>
            </div>
            <div className="flex items-center gap-4 self-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden font-label text-[10px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-3 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3 h-3" />
                FILTERS
              </button>
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="trace-border bg-surface-container-lowest p-6 animate-pulse">
                  <div className="h-56 bg-surface-container mb-4" />
                  <div className="h-3 bg-surface-container w-1/3 mb-2" />
                  <div className="h-5 bg-surface-container w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-6 bg-surface-container" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} NO PRODUCTS FOUND</span>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-3">{inStockOnly ? 'No items are currently in stock.' : 'No items match the current criteria.'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product, idx) => {
                  const imageUrl = getFirstImage(product.image_urls)
                  const specs = getSpecsForProduct(product)
                  return (
                    <Link
                      key={`${product.table_name}-${product.id}-${idx}`}
                      to={`/product/${product.table_name}/${product.id}`}
                      className="trace-border bg-surface-container-lowest transition-all duration-300 hover:bg-surface-container group flex flex-col h-full"
                    >
                      <div className="relative h-56 bg-surface-container flex items-center justify-center p-6 overflow-hidden">
                        {product.stock != null && (
                          <div className={`absolute top-3 left-3 z-10 font-label text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm ${
                            product.stock > 5
                              ? 'bg-green-600 text-white'
                              : product.stock > 0
                              ? 'bg-amber-500 text-white'
                              : 'bg-red-600 text-white'
                          }`}>
                            {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Low Stock: ${product.stock}` : 'Out of Stock'}
                          </div>
                        )}
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            onError={e => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <span className="font-headline text-5xl text-outline/20">{product.name?.[0] || '?'}</span>
                        )}
                      </div>
                      <div className="p-5 md:p-6 flex flex-col flex-grow">
                        <div className="mb-3">
                          <span className="font-label text-[11px] text-primary tracking-[0.15em] uppercase">{product.manufacturer || 'GENERIC'}</span>
                          <h3 className="font-headline text-xl md:text-2xl tracking-tight text-on-surface leading-tight mt-0.5">
                            {product.name || 'PRODUCT NAME'}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-auto pt-4">
                          {specs.map((spec) => (
                            <div key={spec.label}>
                              <div className="font-label text-[11px] text-on-surface-variant tracking-[0.15em] uppercase">{spec.label}</div>
                              <div className="font-body text-[11px] text-on-surface">{spec.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-4 gap-3">
                          <span className="font-headline text-xl tracking-tight text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.stock != null && product.stock > 0 ? (
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`flex items-center gap-1.5 font-label text-[11px] tracking-[0.15em] uppercase px-3 py-2 rounded transition-all ${
                                addedIds.has(`${product.table_name}-${product.id}`)
                                  ? 'bg-green-600 text-white'
                                  : 'bg-primary text-on-primary hover:bg-primary-fixed-dim'
                              }`}
                            >
                              {addedIds.has(`${product.table_name}-${product.id}`) ? (
                                <><Check className="w-3 h-3" /> ADDED</>
                              ) : (
                                <><ShoppingCart className="w-3 h-3" /> ADD TO CART</>
                              )}
                            </button>
                          ) : (
                            <span className="font-label text-[11px] tracking-[0.15em] uppercase text-red-500">
                              {product.stock != null ? 'OUT OF STOCK' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
                  <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider order-2 md:order-1">
                    SHOWING {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, count)} OF {count} ITEMS{inStockOnly ? ` (${filteredProducts.length} in stock)` : ''}
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

      <Footer />
    </div>
  )
}

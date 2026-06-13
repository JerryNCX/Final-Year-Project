import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Plus, Check, Loader2, Search, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { useBuild, CATEGORIES } from '@/lib/BuildContext'
import { searchProducts, compatibleProducts } from '@/lib/api'

const PAGE_SIZE = 24

const URL_TO_TABLE = {
  'cpu': 'CPU', 'gpu': 'GPU', 'motherboard': 'Motherboard',
  'memory': 'Memory', 'case': 'Case', 'psu': 'PSU',
  'cpu-cooler': 'CPU Cooler', 'internal-drive': 'Internal Drive',
}

const TITLE_MAP = {
  CPU: 'Select Processor', GPU: 'Select Graphics Card',
  Motherboard: 'Select Motherboard', Memory: 'Select Memory',
  'CPU Cooler': 'Select CPU Cooler', Case: 'Select Case',
  PSU: 'Select Power Supply', 'Internal Drive': 'Select Storage',
}

const PRIORITY = ['CPU', 'Motherboard', 'GPU', 'Case', 'Memory', 'CPU Cooler', 'PSU', 'Internal Drive']

const CONSTRAINT_PAIRS = new Set([
  'CPU->Motherboard', 'CPU->CPU Cooler',
  'Motherboard->CPU', 'Motherboard->Memory', 'Motherboard->Case',
  'Motherboard->CPU Cooler', 'Motherboard->Internal Drive',
  'GPU->Case', 'GPU->PSU',
  'Case->Motherboard', 'Case->GPU', 'Case->PSU', 'Case->Internal Drive',
  'Memory->Motherboard', 'PSU->Case',
  'CPU Cooler->CPU', 'CPU Cooler->Motherboard',
  'Internal Drive->Motherboard', 'Internal Drive->Case',
])

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
]

function getSpecLines(product) {
  const s = product.specs || {}
  const lines = []
  if (s.socket) lines.push(`Socket: ${s.socket}`)
  if (s.core_count) lines.push(`${s.core_count} Cores`)
  if (s.tdp) lines.push(`${s.tdp} TDP`)
  if (s.memory) lines.push(`VRAM: ${s.memory}`)
  if (s.speed) lines.push(`Speed: ${s.speed}`)
  if (s.form_factor) lines.push(`Form: ${s.form_factor}`)
  if (s.wattage) lines.push(`${s.wattage}`)
  if (s.type) lines.push(`${s.type}`)
  if (s.capacity) lines.push(`${s.capacity}GB`)
  if (s.interface) lines.push(`${s.interface}`)
  return lines.slice(0, 3)
}

function getSelectedId(build, category) {
  const v = build[category]
  if (!v) return null
  if (Array.isArray(v)) return v.length > 0 ? v[0].id : null
  return v.id
}

function findFromEntry(build, targetTable) {
  for (const cat of PRIORITY) {
    const comp = build[cat]
    if (!comp) continue
    if (Array.isArray(comp) && comp.length === 0) continue
    const entry = Array.isArray(comp) ? comp[0] : comp
    const key = `${entry.table_name}->${targetTable}`
    if (!CONSTRAINT_PAIRS.has(key)) continue
    return { table_name: entry.table_name, id: entry.id }
  }
  return null
}

export default function ChooseComponent() {
  const { category: urlCategory } = useParams()
  const navigate = useNavigate()
  const { build, addComponent } = useBuild()

  const targetTable = URL_TO_TABLE[urlCategory] || urlCategory
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [added, setAdded] = useState(new Set())
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async (q, sort, pageNum) => {
    setLoading(true)
    setError('')
    try {
      if (q.trim()) {
        const res = await searchProducts({ q, category: targetTable, limit: PAGE_SIZE, offset: pageNum * PAGE_SIZE, sort_by: sort })
        setProducts(res.results || [])
        setTotal(res.count || 0)
      } else {
        const fromEntry = findFromEntry(build, targetTable)
        if (fromEntry) {
          const ctxCpuId = getSelectedId(build, 'CPU')
          const ctxGpuId = getSelectedId(build, 'GPU')
          const res = await compatibleProducts({
            from_table: fromEntry.table_name,
            from_id: fromEntry.id,
            target_table: targetTable,
            limit: PAGE_SIZE,
            offset: pageNum * PAGE_SIZE,
            context_cpu_id: ctxCpuId,
            context_gpu_id: ctxGpuId,
          })
          setProducts(res.results || [])
          setTotal(res.count || 0)
        } else {
          const res = await searchProducts({ category: targetTable, limit: PAGE_SIZE, offset: pageNum * PAGE_SIZE, sort_by: sort })
          setProducts(res.results || [])
          setTotal(res.count || 0)
        }
      }
    } catch (e) {
      setProducts([])
      setError(e.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [build, targetTable])

  useEffect(() => {
    setPage(0)
    setAdded(new Set())
  }, [targetTable])

  useEffect(() => {
    fetchProducts(searchQuery, sortBy, page)
  }, [build, targetTable, searchQuery, sortBy, page, fetchProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchProducts(searchQuery, sortBy, 0)
  }

  const handleSort = (val) => {
    setSortBy(val)
    setPage(0)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function handleAdd(product) {
    if (targetTable === 'Internal Drive') {
      addComponent('Internal Drive', product)
      setAdded(prev => new Set(prev).add(product.id))
    } else {
      addComponent(targetTable, product)
      navigate('/build')
    }
  }

  const title = TITLE_MAP[targetTable] || 'Select Component'

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      <Header />
      <div className="max-w-[1400px] mx-auto px-10 py-8">
        <button onClick={() => navigate('/build')} className="flex items-center gap-2 text-sm font-label text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to System Builder
        </button>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface mb-1">{title}</h1>
            <p className="text-on-surface-variant text-sm">{total} option{total !== 1 ? 's' : ''} available.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              className="w-full bg-surface-container-low text-on-surface font-body pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors text-sm"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(''); setPage(0) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <select
            value={sortBy}
            onChange={e => handleSort(e.target.value)}
            className="bg-surface-container-low text-on-surface font-body px-4 py-2.5 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors text-sm"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="text-lg mb-2 text-error">Error loading products</p>
            <p className="text-sm mb-4">{error}</p>
            <button onClick={() => fetchProducts(searchQuery, sortBy, page)} className="primary-gradient-btn px-5 py-2.5 text-on-primary font-label font-semibold rounded-lg">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="text-lg mb-2">No {searchQuery ? 'matching ' : ''}products found</p>
            <p className="text-sm">
              {searchQuery
                ? 'Try a different search term.'
                : 'Try selecting a different component first, or browse all products from the catalog.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => {
                const specLines = getSpecLines(p)
                const isAdded = targetTable === 'Internal Drive' && added.has(p.id)
                return (
                  <div key={p.id} className="ghost-border rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] bg-surface-container-high rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {p.image_urls ? (
                        <img
                          src={(() => { try { return JSON.parse(p.image_urls)[0] } catch { return p.image_urls } })()}
                          alt={p.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-on-surface-variant text-xs">{p.table_name}</span>
                      )}
                    </div>
                    <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mb-2 line-clamp-2">{p.name}</h3>
                    <div className="space-y-0.5 mb-3">
                      {specLines.map((l, i) => (
                        <p key={i} className="text-xs text-on-surface-variant">{l}</p>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-headline font-bold text-base text-on-surface">RM{(() => { try { return parseFloat(p.price).toFixed(2) } catch { return p.price || '0.00' } })()}</span>
                      <button
                        onClick={() => handleAdd(p)}
                        disabled={isAdded}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                          isAdded
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'primary-gradient-btn text-on-primary hover:opacity-90'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-label transition-all ${
                      i === page
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

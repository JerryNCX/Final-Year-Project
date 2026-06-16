import React, { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, ChevronLeft, ChevronRight, Trash2, Save, PackageX } from 'lucide-react'
import { searchProducts, getCategories } from '@/features/catalog/api/catalog'
import { adminUpdateProduct, adminDeleteProduct } from '@/features/admin/api/admin'
import { formatPrice } from '@/utils/currency'
import { CATEGORIES } from '@/config/categories'
import CategorySidebar from '@/features/admin/components/CategorySidebar'

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categoryCounts, setCategoryCounts] = useState({})
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [editingStock, setEditingStock] = useState({})
  const limit = 30

  const loadCounts = useCallback(async () => {
    try {
      const cats = await getCategories()
      const counts = {}
      let allCount = 0
      for (const c of cats) {
        counts[c.name] = c.product_count || 0
        allCount += c.product_count || 0
      }
      setCategoryCounts(counts)
      setTotalCount(allCount)
    } catch {
      setCategoryCounts({})
      setTotalCount(0)
    }
  }, [])

  const loadProducts = useCallback(async (categoryToLoad, searchToLoad, pageToLoad) => {
    setLoading(true)
    try {
      const cat = categoryToLoad === 'All' ? null : categoryToLoad
      const res = await searchProducts({ q: searchToLoad, category: cat, limit, offset: pageToLoad * limit })
      setProducts(res.results || [])
      if (cat) {
        setTotalCount(res.count || 0)
      }
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCounts() }, [loadCounts])

  useEffect(() => {
    if (selectedCategory === 'All') loadCounts()
    loadProducts(selectedCategory, searchQuery, 0)
    setPage(0)
  }, [selectedCategory, searchQuery, loadProducts, loadCounts])

  useEffect(() => {
    loadProducts(selectedCategory, searchQuery, page)
  }, [page, selectedCategory, searchQuery, loadProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(search)
    setPage(0)
  }

  const handleClearSearch = () => {
    setSearch('')
    setSearchQuery('')
    setPage(0)
  }

  const handleStockChange = (product, newStock) => {
    setEditingStock(prev => ({ ...prev, [`${product.table_name}-${product.id}`]: newStock }))
  }

  const handleSaveStock = async (product) => {
    const key = `${product.table_name}-${product.id}`
    const newStock = editingStock[key]
    if (newStock === undefined || newStock === product.stock) return
    try {
      const updated = await adminUpdateProduct(product.table_name, product.id, { stock: parseInt(newStock, 10) || 0 })
      setProducts(prev => prev.map(p => (p.id === product.id && p.table_name === product.table_name) ? { ...p, stock: updated.stock } : p))
      setEditingStock(prev => {
        const copy = { ...prev }
        delete copy[key]
        return copy
      })
    } catch (err) {
      alert('Failed to update stock: ' + err.message)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      const res = await adminDeleteProduct(product.table_name, product.id)
      setProducts(prev => prev.filter(p => !(p.id === product.id && p.table_name === product.table_name)))
      setTotalCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      alert('Failed to delete product: ' + err.message)
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-6">
          <CategorySidebar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
            totalCount={totalCount}
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-on-surface mb-4 font-headline">Product Management</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 ghost-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container placeholder:text-outline text-on-surface"
              />
            </div>
            <button type="submit" className="px-4 py-2 primary-gradient-btn">Search</button>
            {search && (
              <button type="button" onClick={handleClearSearch} className="px-4 py-2 text-on-surface-variant ghost-border rounded-sm hover:bg-surface-container font-label">
                Clear
              </button>
            )}
          </form>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-on-surface-variant font-label">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <PackageX className="w-10 h-10 mx-auto mb-4 text-outline" />
            <p className="text-on-surface-variant font-label">No products found.</p>
            {search
              ? <button onClick={handleClearSearch} className="mt-3 text-xs text-primary hover:underline font-label block mx-auto">Clear Search</button>
              : <p className="text-sm text-on-surface-variant mt-2 font-label">Add your first product to get started.</p>
            }
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => {
                const key = `${product.table_name}-${product.id}`
                const isEditingStock = editingStock[key] !== undefined
                return (
                  <div key={key} className="trace-border bg-surface-container-lowest overflow-hidden flex flex-col transition-all duration-300 hover:bg-surface-container">
                    <div className="aspect-square bg-surface-container relative overflow-hidden">
                      {(() => { try {
                        const urls = JSON.parse(product.image_urls || '[]')
                        const img = Array.isArray(urls) ? urls[0] : null
                        return img ? <img src={img} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} /> : null
                      } catch { return null } })() || (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-label text-[10px] text-outline uppercase tracking-wider">{product.table_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <span className="font-label text-[10px] text-primary uppercase tracking-wider mb-1">{product.table_name}</span>
                      <h4 className="font-label text-xs text-on-surface mb-1 leading-snug uppercase tracking-wider line-clamp-2">{product.name}</h4>
                      <span className="font-label text-sm text-primary mb-2">{formatPrice(product.price)}</span>
                      <div className="mt-auto space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Stock:</span>
                          <input
                            type="number"
                            min="0"
                            value={isEditingStock ? editingStock[key] : (product.stock ?? 0)}
                            onChange={(e) => handleStockChange(product, e.target.value)}
                            className="w-16 font-label text-xs text-on-surface bg-surface-container border border-outline/30 rounded-sm px-1.5 py-0.5 focus:outline-none focus:border-primary/50"
                          />
                          {isEditingStock && (
                            <button onClick={() => handleSaveStock(product)} className="ml-1 p-1 text-green-600 hover:text-green-700 transition-colors">
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(product)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 font-label text-[10px] tracking-wider uppercase text-error border border-error/30 hover:bg-error/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-on-surface-variant font-label">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, totalCount)} of {totalCount} products
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || loading} className="flex items-center gap-1 px-3 py-1.5 text-sm ghost-border rounded-sm hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed font-label">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let start = Math.max(0, Math.min(page - 2, totalPages - 5))
                      const p = start + i
                      if (p >= totalPages) return null
                      return (
                        <button key={p} onClick={() => setPage(p)} disabled={loading}
                          className={`w-8 h-8 text-sm rounded-sm font-label ${page === p ? 'primary-gradient-btn' : 'ghost-border hover:bg-surface-container disabled:opacity-50'}`}>
                          {p + 1}
                        </button>
                      )
                    })}
                  </div>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1 || loading} className="flex items-center gap-1 px-3 py-1.5 text-sm ghost-border rounded-sm hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed font-label">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

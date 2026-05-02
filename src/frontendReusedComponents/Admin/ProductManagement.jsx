import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIES, fetchAdminProducts, getCategoryCounts } from '@/lib/supabase'
import CategorySidebar from './CategorySidebar'
import ProductCard from './ProductCard'

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [counts, setCounts] = useState({})
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const limit = 30
  const totalPages = Math.ceil(totalCount / limit)
  
  const isLoadingRef = useRef(false)
  const currentRequestRef = useRef({ page: 0, category: 'All', search: '' })

  const loadCounts = useCallback(async () => {
    setLoadingCounts(true)
    const result = await getCategoryCounts()
    setCounts(result.counts || {})
    setTotalCount(result.allCount || 0)
    setLoadingCounts(false)
  }, [])

  const loadProducts = useCallback(async (categoryToLoad, searchToLoad, pageToLoad) => {
    if (isLoadingRef.current) return
    
    isLoadingRef.current = true
    setLoading(true)
    
    const result = await fetchAdminProducts({
      category: categoryToLoad,
      search: searchToLoad,
      page: pageToLoad,
      limit: limit
    })
    
    setProducts(result.products || [])
    isLoadingRef.current = false
    setLoading(false)
  }, [])

  useEffect(() => {
    loadCounts()
  }, [loadCounts])

  useEffect(() => {
    if (loadingCounts) return
    const categoryToLoad = selectedCategory
    const searchToLoad = searchQuery
    const pageToLoad = 0
    
    currentRequestRef.current = { category: categoryToLoad, search: searchToLoad, page: pageToLoad }
    setPage(0)
    loadProducts(categoryToLoad, searchToLoad, pageToLoad)
  }, [selectedCategory, searchQuery, loadingCounts, loadProducts])

  useEffect(() => {
    if (loadingCounts) return
    if (page === currentRequestRef.current.page && 
        selectedCategory === currentRequestRef.current.category &&
        searchQuery === currentRequestRef.current.search) {
      return
    }
    
    currentRequestRef.current = { ...currentRequestRef.current, page: page }
    loadProducts(selectedCategory, searchQuery, page)
  }, [page, selectedCategory, searchQuery, loadingCounts, loadProducts])

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

  const handleCategoryUpdate = (productId, newCategory) => {
    setCounts(prev => ({
      ...prev,
      [newCategory]: (prev[newCategory] || 0) + 1,
      [selectedCategory]: Math.max(0, (prev[selectedCategory] || 1) - 1)
    }))
    setTotalCount(prev => prev)
  }

  const handleProductDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    setCounts(prev => ({
      ...prev,
      [selectedCategory]: Math.max(0, (prev[selectedCategory] || 1) - 1)
    }))
    setTotalCount(prev => prev - 1)
  }

  const handlePageChange = (newPage) => {
    if (loading || isLoadingRef.current) return
    setPage(newPage)
  }

  return (
    <div className="flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-6">
          <CategorySidebar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={counts}
            totalCount={totalCount}
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Management</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found.</p>
            {search && (
              <button
                onClick={handleClearSearch}
                className="mt-2 text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdate={handleCategoryUpdate}
                  onDelete={handleProductDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, totalCount)} of {totalCount} products
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0 || loading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {(() => {
                      const visiblePages = []
                      let startPage = Math.max(0, page - 2)
                      let endPage = Math.min(totalPages - 1, page + 2)
                      
                      if (page < 3) {
                        endPage = Math.min(4, totalPages - 1)
                      }
                      if (page > totalPages - 3) {
                        startPage = Math.max(0, totalPages - 5)
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        visiblePages.push(i)
                      }
                      
                      return visiblePages.map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`w-8 h-8 text-sm rounded-lg ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border hover:bg-gray-50 disabled:opacity-50'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))
                    })()}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1 || loading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
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
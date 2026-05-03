import React, { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { CATEGORIES, supabase } from '@/lib/supabase'

const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export default function TextSearchTab({ showFilters }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedRating, setSelectedRating] = useState(null)

  const performSearch = useCallback(async (searchQuery, categories, priceMin, priceMax, rating) => {
    if (!searchQuery.trim() && categories.length === 0 && !priceMin && !priceMax && !rating) {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      let supabaseQuery = supabase
        .from('Product_Catalog')
        .select('*')
        .limit(50)

      // Text search
      if (searchQuery.trim()) {
        supabaseQuery = supabaseQuery.ilike('Product_name', `%${searchQuery}%`)
      }

      // Category filter
      if (categories.length > 0) {
        supabaseQuery = supabaseQuery.in('category', categories)
      }

      // Rating filter (approximate)
      if (rating) {
        supabaseQuery = supabaseQuery.gte('Stars', `${rating}`)
      }

      const { data, error } = await supabaseQuery

      if (error) {
        console.error('Search error:', error)
        setResults([])
      } else {
        let filteredData = data || []

        // Price filter (client-side since price format varies)
        if (priceMin || priceMax) {
          filteredData = filteredData.filter(item => {
            const priceStr = item.Current_price || ''
            const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, ''))
            if (isNaN(priceNum)) return false
            if (priceMin && priceNum < parseFloat(priceMin)) return false
            if (priceMax && priceNum > parseFloat(priceMax)) return false
            return true
          })
        }

        setResults(filteredData)
      }
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback(
    debounce((q, cats, pMin, pMax, rat) => performSearch(q, cats, pMin, pMax, rat), 300),
    [performSearch]
  )

  useEffect(() => {
    debouncedSearch(query, selectedCategories, priceRange.min, priceRange.max, selectedRating)
  }, [query, selectedCategories, priceRange, selectedRating, debouncedSearch])

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return price
  }

  const extractShortName = (fullName) => {
    if (!fullName) return 'Unknown Product'
    return fullName.length > 60 ? fullName.substring(0, 60) + '...' : fullName
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
    setSelectedRating(null)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filters</span>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <span className="text-xs text-gray-500 block mb-2">Category</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategories.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <span className="text-xs text-gray-500 block mb-2">Price Range (MYR)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="Min"
                className="w-24 px-3 py-1 text-sm border rounded"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="Max"
                className="w-24 px-3 py-1 text-sm border rounded"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <span className="text-xs text-gray-500 block mb-2">Minimum Rating</span>
            <div className="flex gap-2">
              {[4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedRating === rating
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {rating}+ ⭐
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-500">Searching...</span>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found. Try different keywords or filters.
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product, index) => (
            <div
              key={`${product.ASIN}-${index}`}
              className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                {product.Image ? (
                  <img
                    src={product.Image}
                    alt={product.Product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <p className="text-xs font-medium line-clamp-2">
                {extractShortName(product.Product_name)}
              </p>
              <p className="text-sm font-semibold mt-1">
                {formatPrice(product.Current_price)}
              </p>
              <p className="text-xs text-gray-500">{product.Stars}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          Start typing to search for products
        </div>
      )}
    </div>
  )
}
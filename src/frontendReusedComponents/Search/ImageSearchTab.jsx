import React, { useState, useRef } from 'react'
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react'
import { analyzeImage, processAnalysisResults } from '@/lib/imageSearch'
import { supabase } from '@/lib/supabase'

export default function ImageSearchTab({ showFilters }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const handleFileSelect = (file) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setError(null)
    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResults(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)

    try {
      const data = await analyzeImage(selectedImage)
      const processed = processAnalysisResults(data)

      // If there are products from matches, fetch full product data from Supabase
      if (processed.hasProductMatches && processed.products.length > 0) {
        const productIds = processed.products.map(p => p.id).filter(Boolean)
        
        if (productIds.length > 0) {
          const { data: productData } = await supabase
            .from('Product_Catalog')
            .select('*')
            .in('id', productIds)

          if (productData) {
            processed.products = productData
          }
        }
      }

      setResults(processed)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.message || 'Failed to analyze image')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResults(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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

  const filteredProducts = results?.products?.filter(product => {
    let passesFilter = true
    
    if (selectedCategories.length > 0) {
      passesFilter = passesFilter && selectedCategories.includes(product.category)
    }

    if (priceRange.min || priceRange.max) {
      const priceStr = product.Current_price || ''
      const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, ''))
      if (!isNaN(priceNum)) {
        if (priceRange.min && priceNum < parseFloat(priceRange.min)) passesFilter = false
        if (priceRange.max && priceNum > parseFloat(priceRange.max)) passesFilter = false
      }
    }

    return passesFilter
  }) || []

  return (
    <div className="space-y-4">
      {!results ? (
        <>
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Supports JPG, PNG, WebP
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Analyze Button */}
          {selectedImage && !loading && (
            <button
              onClick={handleAnalyze}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analyze Image
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-500">Analyzing image...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{results.message}</p>
              {results.hasProductMatches && (
                <p className="text-sm text-gray-500">
                  Found {filteredProducts.length} matching product(s)
                </p>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-blue-600 hover:underline text-sm"
            >
              Try another image
            </button>
          </div>

          {/* Filters for Results */}
          {results.hasProductMatches && showFilters && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Category:</span>
                {['CPU', 'GPU', 'RAM', 'Motherboard', 'SSD', 'PSU', 'PC Case', 'CPU Cooler'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-2 py-0.5 text-xs rounded-full border ${
                      selectedCategories.includes(cat)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detected Categories (Fallback) */}
          {results.categories.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Detected Components:
              </p>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((cat, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
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
            results.hasProductMatches && (
              <p className="text-center text-gray-500 py-4">
                No products match the selected filters
              </p>
            )
          )}

          {/* No Products Found Message */}
          {!results.hasProductMatches && (
            <div className="text-center py-6 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No matching products found in the database.</p>
              <p className="text-sm text-gray-400 mt-1">
                The image was analyzed and detected components are shown above.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
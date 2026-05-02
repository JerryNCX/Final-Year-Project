import React, { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { CATEGORIES, updateProductCategory, deleteProduct } from '@/lib/supabase'

export default function ProductCard({ product, onUpdate, onDelete }) {
  const [category, setCategory] = useState(product.category)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCategoryChange = async (newCategory) => {
    if (newCategory === category) return
    
    setIsUpdating(true)
    const result = await updateProductCategory(product.id, newCategory)
    
    if (result.success) {
      setCategory(newCategory)
      onUpdate(product.id, newCategory)
    } else {
      console.error('Failed to update category:', result.error)
      alert('Failed to update category. Please try again.')
    }
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteProduct(product.id)
    
    if (result.success) {
      onDelete(product.id)
    } else {
      console.error('Failed to delete product:', result.error)
      alert('Failed to delete product. Please try again.')
    }
    setIsDeleting(false)
    setShowDeleteConfirm(false)
  }

  const truncateName = (name, maxLength = 100) => {
    if (!name) return 'Unknown Product'
    if (name.length <= maxLength) return name
    return name.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.Image ? (
          <img
            src={product.Image}
            alt={product.Product_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 mb-1">ASIN: {product.ASIN}</p>
        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-3">
          {truncateName(product.Product_name)}
        </h4>
        
        <div className="mt-auto space-y-2">
          <select
            value={category || 'Uncategorized'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isUpdating}
            className="w-full text-sm border rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {isUpdating && (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating...
            </div>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
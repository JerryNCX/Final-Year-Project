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
    <div className="trace-border bg-surface-container-lowest overflow-hidden flex flex-col transition-all duration-300 hover:bg-surface-container">
      <div className="aspect-square bg-surface-container relative overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-label text-[10px] text-outline uppercase tracking-wider">NO IMAGE</span>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-1">ASIN: {product.ASIN}</p>
        <h4 className="font-label text-xs text-on-surface mb-2 leading-snug uppercase tracking-wider">
          {truncateName(product.Product_name)}
        </h4>

        <div className="mt-auto space-y-2">
          <select
            value={category || 'Uncategorized'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isUpdating}
            className="w-full font-label text-[10px] tracking-wider uppercase border border-outline/30 bg-surface-container-lowest text-on-surface px-2 py-1.5 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {isUpdating && (
            <div className="flex items-center justify-center gap-2 font-label text-[10px] text-primary uppercase tracking-wider bg-primary/5 py-1 animate-pulse-amber">
              <Loader2 className="w-3 h-3 animate-spin" />
              UPDATING...
            </div>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 font-label text-[10px] tracking-wider uppercase text-error border border-error/30 hover:bg-error/10 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            DELETE
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="diagnostic-panel p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/15">
              <span className="w-2 h-2 bg-error animate-pulse" />
              <h3 className="font-label text-xs tracking-[0.15em] uppercase text-error">Confirm Delete</h3>
            </div>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mb-6 leading-relaxed">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant border border-outline/30 hover:bg-surface-container transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 font-label text-[10px] tracking-[0.15em] uppercase text-on-error bg-error hover:bg-error/90 transition-colors"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

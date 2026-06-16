import React, { useState } from 'react'
import { Trash2, Loader2, Save } from 'lucide-react'
import { adminUpdateProduct, adminDeleteProduct } from '@/features/admin/api/admin'

export default function ProductCard({ product, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [stock, setStock] = useState(product.stock ?? 0)
  const [isStockDirty, setIsStockDirty] = useState(false)

  const handleStockSave = async () => {
    if (stock === product.stock) return
    setIsUpdating(true)
    try {
      const updated = await adminUpdateProduct(product.table_name, product.id, { stock: parseInt(stock, 10) || 0 })
      setStock(updated.stock ?? 0)
      setIsStockDirty(false)
    } catch (err) {
      alert('Failed to update stock: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await adminDeleteProduct(product.table_name, product.id)
      onDelete(product.id)
    } catch (err) {
      alert('Failed to delete product: ' + err.message)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const truncateName = (name, maxLength = 100) => {
    if (!name) return 'Unknown Product'
    if (name.length <= maxLength) return name
    return name.substring(0, maxLength) + '...'
  }

  const imgUrl = (() => {
    try {
      const urls = JSON.parse(product.image_urls || '[]')
      return Array.isArray(urls) ? urls[0] : null
    } catch { return null }
  })()

  return (
    <div className="trace-border bg-surface-container-lowest overflow-hidden flex flex-col transition-all duration-300 hover:bg-surface-container">
      <div className="aspect-square bg-surface-container relative overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-label text-[10px] text-outline uppercase tracking-wider">{product.table_name}</span>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <span className="font-label text-[10px] text-primary uppercase tracking-wider mb-1">{product.table_name}</span>
        <h4 className="font-label text-xs text-on-surface mb-2 leading-snug uppercase tracking-wider">
          {truncateName(product.name)}
        </h4>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1">
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Stock:</span>
            <input
              type="number" min="0"
              value={stock}
              onChange={(e) => { setStock(e.target.value); setIsStockDirty(true) }}
              className="w-16 font-label text-xs text-on-surface bg-surface-container border border-outline/30 rounded-sm px-1.5 py-0.5 focus:outline-none focus:border-primary/50"
            />
            {isStockDirty && (
              <button onClick={handleStockSave} disabled={isUpdating} className="ml-1 p-1 text-green-600 hover:text-green-700 transition-colors">
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 font-label text-[10px] tracking-wider uppercase text-error border border-error/30 hover:bg-error/10 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
              >CANCEL</button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 font-label text-[10px] tracking-[0.15em] uppercase text-on-error bg-error hover:bg-error/90 transition-colors"
              >DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Package, Calendar, Loader2, AlertCircle, Search, User as UserIcon } from 'lucide-react'
import { adminListOrders } from '@/lib/api'
import { formatPrice } from '@/lib/currency'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusStyles = {
  pending: 'text-amber-600 bg-amber-500/10',
  shipped: 'text-blue-600 bg-blue-500/10',
  delivered: 'text-green-600 bg-green-500/10',
  cancelled: 'text-error bg-error/10',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    let cancelled = false
    const fetchOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await adminListOrders()
        if (!cancelled) setOrders(res?.data || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load orders')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOrders()
    return () => { cancelled = true }
  }, [])

  const filtered = orders
    .filter(o => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        o.id?.toLowerCase().includes(q) ||
        o.user_id?.toLowerCase().includes(q) ||
        String(o.total).includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'highest') return (b.total || 0) - (a.total || 0)
      if (sortBy === 'lowest') return (a.total || 0) - (b.total || 0)
      return new Date(b.created_at) - new Date(a.created_at)
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Orders</h1>
          <p className="text-sm font-label text-on-surface-variant mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-error-container/30 text-on-error-container px-4 py-3 rounded-lg text-sm font-label">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-3 py-2 bg-surface-container-high rounded-lg text-sm font-label text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-surface-container-high rounded-lg text-sm font-label text-on-surface px-3 py-2 border-none focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Total</option>
          <option value="lowest">Lowest Total</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Package className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-label text-sm">{orders.length === 0 ? 'No orders yet' : 'No orders match your search'}</p>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/50">
                  <th className="text-left font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">Order ID</th>
                  <th className="text-left font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">User</th>
                  <th className="text-left font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">Items</th>
                  <th className="text-right font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-center font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right font-label text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((order) => {
                  const snapshot = order.build_snapshot || {}
                  const items = snapshot.cartItems || []
                  const itemCount = items.length
                  const hasBuild = snapshot.build && Object.keys(snapshot.build).length > 0
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-label font-medium text-on-surface text-xs font-mono">
                          #{order.id?.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-3.5 h-3.5 text-on-surface-variant" />
                          <span className="font-label text-xs text-on-surface-variant font-mono">
                            {order.user_id?.slice(0, 12)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-label text-sm text-on-surface">
                          {hasBuild ? 'Build + ' : ''}{itemCount} item{itemCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-label font-medium text-on-surface">{formatPrice(order.total)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-label px-2.5 py-1 rounded ${
                          statusStyles[order.status] || 'text-on-surface-variant bg-surface-container-high'
                        }`}>
                          {(order.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-label text-on-surface-variant">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

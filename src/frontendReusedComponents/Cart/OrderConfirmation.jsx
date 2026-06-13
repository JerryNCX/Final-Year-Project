import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin, CreditCard, ShoppingBag, Loader2, AlertCircle } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { getOrder } from '@/lib/api'
import { formatPrice } from '@/lib/currency'

function getDeliveryDate(service) {
  const now = new Date()
  const days = service === 'Express' ? 1 : service === 'Standard' ? 3 : 5
  const eta = new Date(now)
  eta.setDate(eta.getDate() + days)
  return eta.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [order, setOrder] = useState(location.state?.order || null)
  const [cartItems, setCartItems] = useState(location.state?.cartItems || [])
  const [shippingCost, setShippingCost] = useState(location.state?.shippingCost || 0)
  const [selectedDelivery, setSelectedDelivery] = useState(location.state?.selectedDelivery || 'Express')
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.order) return
    let cancelled = false
    const fetchOrder = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getOrder(orderId)
        if (cancelled) return
        setOrder(data)
        const snapshot = data.build_snapshot || {}
        setCartItems(snapshot.cartItems || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load order')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOrder()
    return () => { cancelled = true }
  }, [orderId, location.state])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!order || error) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="w-16 h-16 text-outline/30 mx-auto mb-4" />
            <h1 className="font-headline text-2xl text-on-surface mb-2">Order Not Found</h1>
            <p className="font-label text-sm text-on-surface-variant mb-6">
              {error || 'This order confirmation is no longer available.'}
            </p>
            <Link to="/account" className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm px-6 py-3 rounded-lg hover:bg-primary-fixed-dim transition-colors">
              <ShoppingBag className="w-4 h-4" />
              VIEW ORDER HISTORY
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const eta = getDeliveryDate(selectedDelivery)
  const subtotal = cartItems.reduce((s, i) => s + (i.total || i.price || 0), 0)

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
              ORDER CONFIRMED
            </h1>
            <p className="font-label text-sm text-on-surface-variant">
              Your order has been placed successfully.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Order ID</span>
                <p className="font-headline text-lg text-on-surface mt-0.5 font-mono">{order.id}</p>
              </div>
              <div className="text-right">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Total Charged</span>
                <p className="font-headline text-2xl text-primary mt-0.5">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Delivery</h2>
              </div>
              <div className="space-y-2">
                <p className="font-label text-sm text-on-surface">
                  {selectedDelivery === 'Express' ? 'Priority Overnight' : 'Standard Transport'}
                </p>
                <p className="font-label text-xs text-green-600">
                  Estimated arrival: {eta}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Shipping To</h2>
              </div>
              <div className="space-y-1">
                {order.shipping_address?.first_name && order.shipping_address?.last_name && (
                  <p className="font-label text-sm text-on-surface">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                )}
                <p className="font-label text-xs text-on-surface-variant">{order.shipping_address?.address_line1}</p>
                {order.shipping_address?.address_line2 && (
                  <p className="font-label text-xs text-on-surface-variant">{order.shipping_address.address_line2}</p>
                )}
                <p className="font-label text-xs text-on-surface-variant">
                {order.shipping_address?.zip} {order.shipping_address?.city}, {order.shipping_address?.state}
                </p>
              </div>
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6 md:p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Items Ordered</h2>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {cartItems.map((item, i) => (
                  <div key={item.id || i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <Package className="w-6 h-6 text-outline/30" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-label text-sm text-on-surface truncate">{item.name}</p>
                      <p className="font-label text-xs text-on-surface-variant mt-0.5">{item.category || item._tableName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-label text-sm text-on-surface">{formatPrice(item.price)}</p>
                      {(item.quantity || item.qty) > 1 && <p className="font-label text-xs text-on-surface-variant">x{item.quantity || item.qty}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/20 mt-4 pt-4 space-y-2">
                <div className="flex justify-between font-label text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-label text-sm text-on-surface-variant">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-label text-base text-on-surface font-medium pt-2 border-t border-outline-variant/20">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm px-8 py-3.5 rounded-lg hover:bg-primary-fixed-dim transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              CONTINUE SHOPPING
            </Link>
            <Link
              to="/account"
              className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface font-label text-sm px-8 py-3.5 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              VIEW ORDER HISTORY
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

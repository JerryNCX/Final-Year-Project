import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle, Package, Truck, MapPin, CreditCard, ShoppingBag, AlertCircle, ChevronLeft } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { getOrder, confirmPayment, cancelOrder } from '@/lib/api'
import { formatPrice } from '@/lib/currency'

export default function PaymentPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [order, setOrder] = useState(location.state?.order || null)
  const [cartItems, setCartItems] = useState(location.state?.cartItems || [])
  const [shippingCost, setShippingCost] = useState(location.state?.shippingCost ?? 0)
  const [selectedDelivery, setSelectedDelivery] = useState(location.state?.selectedDelivery ?? 'Express')
  const [loading, setLoading] = useState(!location.state?.order)
  const [submitting, setSubmitting] = useState(false)
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
        setShippingCost(data.shipping_cost ?? 0)
        setSelectedDelivery(data.delivery_method || 'Express')
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load order')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOrder()
    return () => { cancelled = true }
  }, [orderId, location.state])

  const handleConfirm = async () => {
    setSubmitting(true)
    setError('')
    try {
      await confirmPayment(orderId)
      navigate(`/order-confirmation/${orderId}`, {
        state: { order, cartItems, shippingCost, selectedDelivery },
        replace: true,
      })
    } catch (err) {
      setError(err.message || 'Payment confirmation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async () => {
    setSubmitting(true)
    setError('')
    try {
      await cancelOrder(orderId)
      navigate('/cart', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to cancel order')
    } finally {
      setSubmitting(false)
    }
  }

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
              {error || 'This order is no longer available.'}
            </p>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm px-6 py-3 rounded-lg hover:bg-primary-fixed-dim transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              BACK TO CART
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const subtotal = cartItems.reduce((s, i) => s + (i.total || i.price || 0), 0)

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-label text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK
          </button>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
              CONFIRM PAYMENT
            </h1>
            <p className="font-label text-sm text-on-surface-variant">
              Review your order and confirm payment to complete the purchase.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Order ID</span>
                <p className="font-headline text-lg text-on-surface mt-0.5 font-mono">{order.id}</p>
              </div>
              <div className="text-right">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Status</span>
                <p className="font-headline text-lg text-amber-500 mt-0.5">PENDING PAYMENT</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Delivery</h2>
              </div>
              <p className="font-label text-sm text-on-surface">
                {selectedDelivery === 'Express' ? 'Priority Overnight' : 'Standard Transport'}
              </p>
              <p className="font-label text-xs text-on-surface-variant mt-1">
                {selectedDelivery} — RM{Number(shippingCost).toFixed(2)}
              </p>
            </div>

            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Shipping To</h2>
              </div>
              {order.shipping_address?.first_name && (
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

          {cartItems.length > 0 && (
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-6 md:p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-label text-sm uppercase tracking-wider text-on-surface">Items</h2>
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
                  <span>RM{Number(shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-label text-base text-on-surface font-medium pt-2 border-t border-outline-variant/20">
                  <span>Total Due</span>
                  <span className="text-primary">RM{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="font-label text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-label text-sm px-10 py-3.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {submitting ? 'PROCESSING...' : 'CONFIRM PAYMENT'}
            </button>
            <button
              onClick={handleCancel}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface font-label text-sm px-8 py-3.5 rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              CANCEL ORDER
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

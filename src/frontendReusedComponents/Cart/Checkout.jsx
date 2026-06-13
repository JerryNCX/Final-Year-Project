import React, { useState, useEffect, useCallback } from 'react'
import { Lock, ArrowLeft, ArrowRight, Truck, Plane, Shield, Headphones, Loader2, Check, CreditCard, ShoppingBag } from 'lucide-react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import Footer from '../HomePage/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/lib/CartContext'
import { useBuild } from '@/lib/BuildContext'
import { getUserProfile, updateUserProfile, createOrder, calculateShipping } from '@/lib/api'

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { cartItems: allCartItems, subtotal, tax, cartTotal, formatPrice, clearCart } = useCart()
  const { build } = useBuild()
  const cartItems = location.state?.selectedItems || allCartItems

  const [checkoutStep, setCheckoutStep] = useState(1)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [shippingRates, setShippingRates] = useState(null)
  const [selectedDelivery, setSelectedDelivery] = useState('express')
  const [shippingCost, setShippingCost] = useState(24)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/checkout'
      navigate(`/login?redirect=${redirect}`)
    }
  }, [authLoading, isAuthenticated, navigate, searchParams])

  useEffect(() => {
    if (isAuthenticated && !profileLoaded) {
      getUserProfile()
        .then(profile => {
          if (profile && profile.user_id) {
            setForm({
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              address_line1: profile.address_line1 || '',
              address_line2: profile.address_line2 || '',
              city: profile.city || '',
              state: profile.state || '',
              zip: profile.zip || '',
            })
          }
          setProfileLoaded(true)
        })
        .catch(() => setProfileLoaded(true))
    }
  }, [isAuthenticated, profileLoaded])

  const fetchRates = useCallback(async (zip) => {
    if (!zip || zip.length < 5) return
    try {
      const result = await calculateShipping(zip)
      if (result && result.rates) {
        setShippingRates(result.rates)
        const express = result.rates.find(r => r.service === 'Express')
        if (express) setShippingCost(express.cost)
        else setShippingCost(result.rates[0]?.cost || 0)
      }
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (form.zip) {
      const timer = setTimeout(() => fetchRates(form.zip), 500)
      return () => clearTimeout(timer)
    }
  }, [form.zip, fetchRates])

  const handleDeliveryChange = (service) => {
    setSelectedDelivery(service)
    if (shippingRates) {
      const rate = shippingRates.find(r => r.service === service)
      if (rate) setShippingCost(rate.cost)
    }
  }

  const handleContinueToPayment = (e) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.address_line1 || !form.city || !form.state || !form.zip) {
      setOrderError('Please fill in all required shipping fields.')
      return
    }
    setOrderError('')
    setCheckoutStep(2)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    setOrderError('')
    setSubmitting(true)
    try {
      await updateUserProfile(form)
      const shippingAddress = {
        first_name: form.first_name,
        last_name: form.last_name,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        state: form.state,
        zip: form.zip,
      }
      const buildSnapshot = {
        build: build,
        cartItems: cartItems,
      }
      const order = await createOrder(shippingAddress, buildSnapshot, cartTotal + shippingCost)
      clearCart()
      navigate(`/order-confirmation/${order.id}`, {
        state: { order, cartItems, shippingCost, selectedDelivery },
      })
    } catch (err) {
      setOrderError(err?.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const standardRate = shippingRates?.find(r => r.service === 'Standard')
  const expressRate = shippingRates?.find(r => r.service === 'Express')

  const StepIcon = ({ step, current }) => {
    const isActive = step === current
    const isDone = step < current
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label font-bold text-sm mb-2 transition-all ${
        isDone
          ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          : isActive
          ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,72,225,0.3)]'
          : 'bg-surface-container-high text-on-surface-variant'
      }`}>
        {isDone ? <Check className="w-4 h-4" /> : step}
      </div>
    )
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 z-50 border-b border-surface-variant/50">
        <div className="flex items-center justify-between px-10 py-4 max-w-[1920px] mx-auto">
          <span className="font-headline font-bold tracking-tighter text-on-surface text-xl uppercase">PRECISION TECH</span>
          <div className="flex items-center gap-2 text-on-surface-variant font-label text-sm uppercase tracking-[0.1em]">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1920px] mx-auto px-6 md:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
        <div className="lg:col-span-7 flex flex-col gap-12">
          <div className="mb-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">Checkout Process</h1>
            <p className="font-body text-on-surface-variant">Complete your transaction for precision hardware.</p>
          </div>

          <div className="flex items-center w-full mb-8 relative">
            <div className="flex flex-col items-center relative z-10 flex-1">
              <StepIcon step={1} current={checkoutStep} />
              <span className={`font-label text-xs uppercase tracking-wider font-bold ${checkoutStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Shipping</span>
            </div>
            <div className={`flex-1 h-px -mx-4 z-0 ${checkoutStep > 1 ? 'bg-green-500' : 'bg-outline-variant/30'}`} />
            <div className="flex flex-col items-center relative z-10 flex-1">
              <StepIcon step={2} current={checkoutStep} />
              <span className={`font-label text-xs uppercase tracking-wider font-bold ${checkoutStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Payment</span>
            </div>
          </div>

          {orderError && (
            <div className="bg-error-container border border-outline-variant text-on-error-container px-5 py-4 rounded-lg text-sm font-label">
              {orderError}
            </div>
          )}

          {checkoutStep === 1 && (
            <form className="flex flex-col gap-10" onSubmit={handleContinueToPayment}>
              <section className="bg-surface-container-lowest p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.03)] border border-outline-variant/15 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-6 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Email Address</label>
                    <p className="w-full bg-surface-container-low text-on-surface font-body px-4 py-3 border-b-2 border-primary text-sm">
                      {user?.email || '—'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.03)] border border-outline-variant/15">
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-6 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  Shipping Coordinates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">First Name</label>
                    <input required value={form.first_name} onChange={e => updateField('first_name', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="First Name" type="text" />
                  </div>
                  <div>
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Last Name</label>
                    <input required value={form.last_name} onChange={e => updateField('last_name', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Last Name" type="text" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Address Line 1</label>
                    <input required value={form.address_line1} onChange={e => updateField('address_line1', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Street Address, P.O. Box" type="text" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Address Line 2 (Apt / Unit / Suite)</label>
                    <input value={form.address_line2} onChange={e => updateField('address_line2', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Apartment, unit, building, floor, etc." type="text" />
                  </div>
                  <div>
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">City</label>
                    <input required value={form.city} onChange={e => updateField('city', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="City" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">State / Province</label>
                      <select required value={form.state} onChange={e => updateField('state', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200 appearance-none">
                        <option value="">Select...</option>
                        <option value="Johor">Johor</option>
                        <option value="Kedah">Kedah</option>
                        <option value="Kelantan">Kelantan</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Labuan">Labuan</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Negeri Sembilan">Negeri Sembilan</option>
                        <option value="Pahang">Pahang</option>
                        <option value="Perak">Perak</option>
                        <option value="Perlis">Perlis</option>
                        <option value="Penang">Penang</option>
                        <option value="Putrajaya">Putrajaya</option>
                        <option value="Sabah">Sabah</option>
                        <option value="Sarawak">Sarawak</option>
                        <option value="Selangor">Selangor</option>
                        <option value="Terengganu">Terengganu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Postal / Zip Code</label>
                      <input required value={form.zip} onChange={e => updateField('zip', e.target.value)} className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Zip" type="text" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.03)] border border-outline-variant/15">
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-6 flex items-center gap-3">
                  <Plane className="w-5 h-5 text-primary" />
                  Delivery Velocity
                </h2>
                <div className="flex flex-col gap-4">
                  <label className={`relative flex cursor-pointer rounded-lg border ${selectedDelivery === 'Standard' ? 'border-primary bg-surface-bright' : 'border-outline-variant bg-surface-container-low'} p-4 focus:outline-none hover:bg-surface-container transition-colors duration-200`}>
                    <input
                      type="radio"
                      name="delivery_method"
                      value="Standard"
                      checked={selectedDelivery === 'Standard'}
                      onChange={() => handleDeliveryChange('Standard')}
                      className="sr-only"
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block font-label text-sm font-bold text-on-surface uppercase tracking-wide">Standard Transport</span>
                        <span className="mt-1 flex items-center font-body text-sm text-on-surface-variant">
                          {standardRate ? standardRate.days : 'Enter zip to calculate'}. Secure packaging.
                        </span>
                      </span>
                    </span>
                    <span className="mt-2 text-sm font-bold text-on-surface">
                      {standardRate ? `$${standardRate.cost.toFixed(2)}` : '—'}
                    </span>
                  </label>
                  <label className={`relative flex cursor-pointer rounded-lg border-2 ${selectedDelivery === 'Express' ? 'border-primary bg-surface-bright' : 'border-outline-variant bg-surface-container-low'} p-4 focus:outline-none hover:bg-surface-container transition-colors duration-200`}>
                    <input
                      type="radio"
                      name="delivery_method"
                      value="Express"
                      checked={selectedDelivery === 'Express'}
                      onChange={() => handleDeliveryChange('Express')}
                      className="sr-only"
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block font-label text-sm font-bold text-on-surface uppercase tracking-wide flex items-center gap-2">
                          Priority Overnight
                          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-sm">RECOMMENDED</span>
                        </span>
                        <span className="mt-1 flex items-center font-body text-sm text-on-surface-variant">
                          {expressRate ? expressRate.days : 'Enter zip to calculate'}. Anti-static handling.
                        </span>
                      </span>
                    </span>
                    <span className="mt-2 text-sm font-bold text-on-surface">
                      {expressRate ? `+$${expressRate.cost.toFixed(2)}` : '—'}
                    </span>
                  </label>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={() => navigate('/cart')} className="font-label text-sm font-medium text-on-surface flex items-center gap-2 hover:text-primary transition-colors duration-200 group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Return to Cart
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold text-sm uppercase tracking-wide px-8 py-4 rounded-lg shadow-[0_4px_14px_rgba(0,72,225,0.39)] hover:shadow-[0_6px_20px_rgba(0,72,225,0.23)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {checkoutStep === 2 && (
            <form className="flex flex-col gap-10" onSubmit={handlePlaceOrder}>
              <section className="bg-surface-container-lowest p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.03)] border border-outline-variant/15">
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Review & Place Order
                </h2>

                <div className="space-y-6">
                  <div className="bg-surface-container rounded-lg p-5">
                    <h3 className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-3">Shipping To</h3>
                    <div className="space-y-1">
                      <p className="font-label text-sm text-on-surface">{form.first_name} {form.last_name}</p>
                      <p className="font-body text-sm text-on-surface-variant">{form.address_line1}</p>
                      {form.address_line2 && <p className="font-body text-sm text-on-surface-variant">{form.address_line2}</p>}
                      <p className="font-body text-sm text-on-surface-variant">{form.city}, {form.state} {form.zip}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container rounded-lg p-5">
                    <h3 className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-3">Delivery Method</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-label text-sm text-on-surface">
                          {selectedDelivery === 'Express' ? 'Priority Overnight' : 'Standard Transport'}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5">
                          {selectedDelivery === 'Express'
                            ? (expressRate ? expressRate.days : 'Next Business Day')
                            : (standardRate ? standardRate.days : '3-5 Business Days')}
                        </p>
                      </div>
                      <span className="font-label text-sm text-on-surface">${shippingCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-surface-container rounded-lg p-5">
                    <h3 className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-3">Items ({cartItems.length})</h3>
                    <div className="divide-y divide-outline-variant/10 max-h-60 overflow-y-auto">
                      {cartItems.map((item, i) => (
                        <div key={item.id || i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                          <div className="w-12 h-12 bg-surface-container-lowest rounded flex items-center justify-center p-1.5 flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-outline/30" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-label text-sm text-on-surface truncate">{item.name}</p>
                            <p className="font-body text-xs text-on-surface-variant">{item._tableName || item.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-label text-sm text-on-surface">{formatPrice(item.total)}</p>
                            {item.qty > 1 && <p className="font-body text-xs text-on-surface-variant">x{item.qty}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="font-label text-sm font-medium text-on-surface flex items-center gap-2 hover:text-primary transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Shipping
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold text-sm uppercase tracking-wide px-8 py-4 rounded-lg shadow-[0_4px_14px_rgba(0,72,225,0.39)] hover:shadow-[0_6px_20px_rgba(0,72,225,0.23)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      PLACE ORDER — {formatPrice(cartTotal + shippingCost)}
                      <Lock className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 bg-surface-container-low p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.06)] backdrop-blur-xl border border-outline-variant/20 rounded-xl">
            <h3 className="font-display text-xl font-bold tracking-tight text-on-surface mb-8 border-b border-outline-variant/30 pb-4">Order Summary</h3>

            <div className="flex flex-col gap-6 mb-8">
              {cartItems.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No items in cart</p>
              ) : cartItems.map((item, i) => (
                <div key={item.id || i} className="flex gap-4 items-start group">
                  <div className="w-20 h-20 bg-surface-container-lowest flex-shrink-0 flex items-center justify-center p-2 rounded-md border border-outline-variant/15 relative overflow-hidden">
                    {item.image ? (
                      <img alt={item.name} className="w-full h-full object-cover rounded-sm group-hover:scale-110 transition-transform duration-500" src={item.image} />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high rounded-sm" />
                    )}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-surface-container-lowest text-on-surface font-label text-[10px] font-bold flex items-center justify-center rounded-full border border-outline-variant/20">{item.qty}</div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-1">{item.sku}</h4>
                    <p className="font-body font-semibold text-on-surface leading-tight mb-2">{item.name}</p>
                    <p className="font-body text-sm text-secondary font-medium">{item._tableName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-on-surface block">{formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 font-body text-sm border-t border-outline-variant/30 pt-6 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping ({selectedDelivery === 'Express' ? 'Priority Overnight' : 'Standard Transport'})</span>
                <span className="font-medium text-on-surface">+${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-medium text-on-surface">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-outline-variant/30 pt-6">
              <div>
                <span className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-1">Total Due</span>
                <span className="block font-body text-xs text-on-surface-variant">USD</span>
              </div>
              <span className="font-display text-4xl font-bold tracking-tight text-on-surface">{formatPrice(cartTotal + shippingCost)}</span>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-outline border-t border-outline-variant/20 pt-6">
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-5 h-5" />
                <span className="font-label text-[10px] uppercase">Secure</span>
              </div>
              <div className="w-px h-6 bg-outline-variant/30"></div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-5 h-5" />
                <span className="font-label text-[10px] uppercase">Insured</span>
              </div>
              <div className="w-px h-6 bg-outline-variant/30"></div>
              <div className="flex flex-col items-center gap-1">
                <Headphones className="w-5 h-5" />
                <span className="font-label text-[10px] uppercase">Support</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

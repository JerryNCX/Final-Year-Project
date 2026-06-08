import React from 'react'
import { Minus, Plus, X, Lock, Truck, ShoppingCart as CartIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { useCart } from '@/lib/CartContext'

export default function ShoppingCartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, cartTotal, formatPrice } = useCart()
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const handleExecuteOrder = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased flex flex-col selection:bg-primary selection:text-on-primary">
      <Header />

      <main className="flex-grow max-w-[1920px] mx-auto w-full px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">ACTIVE MANIFEST</h1>
          <p className="text-on-surface-variant text-sm tracking-[0.05em] uppercase">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <CartIcon className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-label">Your cart is empty</p>
              <button onClick={() => navigate('/build')} className="mt-4 primary-gradient-btn px-6 py-2.5 text-on-primary font-label font-semibold rounded-lg">
                Build a System
              </button>
            </div>
          ) : cartItems.map(item => (
            <div
              key={item.id}
              className="group bg-surface-container-lowest rounded-lg p-6 relative overflow-hidden transition-colors duration-300 hover:bg-surface-bright flex flex-col sm:flex-row gap-8 items-center border border-outline-variant/15"
            >
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-32 h-32 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                ) : (
                  <CartIcon className="w-8 h-8 text-on-surface-variant/40" />
                )}
              </div>

              <div className="flex-grow flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-start mb-4 w-full">
                  <div>
                    <span className="text-[0.65rem] font-bold tracking-[0.1em] text-on-surface-variant uppercase block mb-1">{item.category}</span>
                    <h3 className="text-xl font-display font-bold text-on-surface leading-tight">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="text-outline hover:text-error transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end w-full mt-auto">
                  <div className="flex gap-4">
                    {item.specs.map((spec, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          spec.variant === 'secondary'
                            ? 'text-secondary bg-secondary-container/10'
                            : 'text-on-surface-variant bg-surface-container-low'
                        }`}
                      >
                        <span className="text-xs font-medium">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-surface-container-low rounded border border-outline-variant/20">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-on-surface">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-display font-bold text-on-surface">{formatPrice(item.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-container-lowest/70 backdrop-blur-[20px] rounded-lg p-8 border border-outline-variant/15 shadow-ambient flex flex-col gap-8">
            <h2 className="text-2xl font-display font-bold text-on-surface uppercase tracking-tight">Telemetry</h2>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-on-surface">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Shipping Calculation</span>
                <span className="font-medium text-on-surface">Calculated at next step</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-medium text-on-surface">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30"></div>

            <div className="flex justify-between items-end">
              <span className="text-sm font-bold tracking-[0.1em] text-on-surface-variant uppercase">Total Required</span>
              <span className="text-3xl font-display font-bold text-on-surface leading-none">{formatPrice(cartTotal)}</span>
            </div>

            <button
              onClick={handleExecuteOrder}
              disabled={cartItems.length === 0}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 px-6 rounded-lg font-bold tracking-wide uppercase text-sm hover:from-primary-container hover:to-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,72,225,0.3)] hover:shadow-[0_0_30px_rgba(0,72,225,0.5)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Execute Order
              <Truck className="w-[18px] h-[18px]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-outline text-xs -mt-4">
              <Lock className="w-[14px] h-[14px]" />
              <span>Encrypted Transaction Path</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

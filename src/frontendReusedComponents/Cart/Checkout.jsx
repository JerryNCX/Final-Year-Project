import React from 'react'
import { Lock, ArrowLeft, ArrowRight, Truck, Plane, Shield, Headphones } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Footer from '../HomePage/Footer'
import { useCart } from '@/lib/CartContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, subtotal, tax, cartTotal, formatPrice, clearCart } = useCart()

  const handleSubmit = (e) => {
    e.preventDefault()
    clearCart()
    navigate('/build')
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
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label font-bold text-sm mb-2 shadow-[0_0_20px_rgba(0,72,225,0.3)]">
                1
              </div>
              <span className="font-label text-xs uppercase tracking-wider text-primary font-bold">Shipping</span>
            </div>
            <div className="absolute top-4 left-[16.666%] right-1/2 h-[2px] bg-outline-variant/30 -z-0"></div>
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label font-bold text-sm mb-2">
                2
              </div>
              <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-medium">Inspection</span>
            </div>
            <div className="absolute top-4 left-1/2 right-[16.666%] h-[2px] bg-outline-variant/30 -z-0"></div>
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label font-bold text-sm mb-2">
                3
              </div>
              <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-medium">Payment</span>
            </div>
          </div>

          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            <section className="bg-surface-container-lowest p-8 lg:p-10 shadow-[0_20px_40px_rgba(26,28,31,0.03)] border border-outline-variant/15 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-6 flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Email Address</label>
                  <input
                    required
                    className="w-full bg-surface-container-low text-on-surface font-body px-4 py-3 border-b-2 border-primary outline-none focus:bg-surface-container transition-colors duration-200"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="flex items-center gap-3 col-span-1 md:col-span-2 mt-2">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        className="h-4 w-4 rounded-sm border-outline text-primary focus:ring-primary bg-surface-container-low"
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-body text-on-surface-variant" htmlFor="newsletter">
                        Send me technical bulletins and exclusive overclocking guides.
                      </label>
                    </div>
                  </div>
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
                  <input required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="First Name" type="text" />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Last Name</label>
                  <input required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Last Name" type="text" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Address Line 1</label>
                  <input required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Street Address, P.O. Box" type="text" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Address Line 2 (Optional)</label>
                  <input className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Apartment, suite, unit, building, floor, etc." type="text" />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">City</label>
                  <input required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="City" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">State / Province</label>
                    <select required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200 appearance-none">
                      <option disabled selected value="">Select...</option>
                      <option value="ca">California</option>
                      <option value="ny">New York</option>
                      <option value="tx">Texas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-2">Postal / Zip Code</label>
                    <input required className="w-full bg-surface-container-high text-on-surface font-body px-4 py-3 border-b-2 border-transparent focus:border-primary outline-none transition-all duration-200" placeholder="Zip" type="text" />
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
                <label className="relative flex cursor-pointer rounded-lg border border-outline-variant bg-surface-container-low p-4 focus:outline-none hover:bg-surface-container transition-colors duration-200">
                  <input aria-describedby="delivery-standard-description" aria-labelledby="delivery-standard-label" className="sr-only" name="delivery_method" type="radio" value="standard" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block font-label text-sm font-bold text-on-surface uppercase tracking-wide" id="delivery-standard-label">Standard Transport</span>
                      <span className="mt-1 flex items-center font-body text-sm text-on-surface-variant" id="delivery-standard-description">3-5 Business Days. Secure packaging.</span>
                    </span>
                  </span>
                  <span className="mt-2 text-sm font-bold text-on-surface">Free</span>
                </label>
                <label className="relative flex cursor-pointer rounded-lg border-2 border-primary bg-surface-bright p-4 focus:outline-none transition-colors duration-200 shadow-[0_4px_20px_rgba(0,72,225,0.08)]">
                  <input aria-describedby="delivery-express-description" aria-labelledby="delivery-express-label" defaultChecked className="sr-only" name="delivery_method" type="radio" value="express" />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block font-label text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2" id="delivery-express-label">
                        Priority Overnight
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-sm">RECOMMENDED</span>
                      </span>
                      <span className="mt-1 flex items-center font-body text-sm text-on-surface-variant" id="delivery-express-description">Next Business Day by 10:30 AM. Anti-static handling.</span>
                    </span>
                  </span>
                  <span className="mt-2 text-sm font-bold text-primary">+$24.00</span>
                </label>
              </div>
            </section>

            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={() => navigate('/cart')} className="font-label text-sm font-medium text-on-surface flex items-center gap-2 hover:text-primary transition-colors duration-200 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Cart
              </button>
              <button type="submit" className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold text-sm uppercase tracking-wide px-8 py-4 rounded-lg shadow-[0_4px_14px_rgba(0,72,225,0.39)] hover:shadow-[0_6px_20px_rgba(0,72,225,0.23)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3">
                Proceed to Inspection
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
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
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover rounded-sm group-hover:scale-110 transition-transform duration-500"
                        src={item.image}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high rounded-sm" />
                    )}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-surface-container-lowest text-on-surface font-label text-[10px] font-bold flex items-center justify-center rounded-full border border-outline-variant/20">
                      {item.qty}
                    </div>
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
                <span>Shipping (Priority Overnight)</span>
                <span className="font-medium text-on-surface">+$24.00</span>
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
              <span className="font-display text-4xl font-bold tracking-tight text-on-surface">{formatPrice(cartTotal + 24)}</span>
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

import React, { useState } from 'react'
import { Minus, Plus, X, Lock, Truck } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'

const initialItems = [
  {
    id: 1,
    image: '',
    category: 'CPU \u2022 Socket AM5',
    name: 'Quantum Core i9-14900KS',
    specs: [
      { label: '6.2 GHz Max', variant: 'default' },
      { label: '150W TDP', variant: 'secondary' }
    ],
    quantity: 1,
    price: 689.00
  },
  {
    id: 2,
    image: '',
    category: 'GPU \u2022 PCIe 4.0',
    name: 'GeForce RTX 4090 Matrix',
    specs: [
      { label: '24GB GDDR6X', variant: 'default' }
    ],
    quantity: 1,
    price: 1999.00
  },
  {
    id: 3,
    image: '',
    category: 'RAM \u2022 DDR5',
    name: 'Dominator Titanium 64GB',
    specs: [
      { label: '6600MT/s', variant: 'default' },
      { label: 'CL32', variant: 'default' }
    ],
    quantity: 2,
    price: 279.00
  }
]

export default function ShoppingCartPage() {
  const [items, setItems] = useState(initialItems.map(item => ({
    ...item,
    total: item.price * item.quantity
  })))

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const newQty = Math.max(1, item.quantity + delta)
      return { ...item, quantity: newQty, total: item.price * newQty }
    }))
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased flex flex-col selection:bg-primary selection:text-on-primary">
      <Header />

      <main className="flex-grow max-w-[1920px] mx-auto w-full px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">ACTIVE MANIFEST</h1>
          <p className="text-on-surface-variant text-sm tracking-[0.05em] uppercase">Order ID: VP-2024-8891-X</p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="group bg-surface-container-lowest rounded-lg p-6 relative overflow-hidden transition-colors duration-300 hover:bg-surface-bright flex flex-col sm:flex-row gap-8 items-center border border-outline-variant/15"
            >
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-32 h-32 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-on-surface-variant/40" />
                )}
              </div>

              <div className="flex-grow flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-start mb-4 w-full">
                  <div>
                    <span className="text-[0.65rem] font-bold tracking-[0.1em] text-on-surface-variant uppercase block mb-1">{item.category}</span>
                    <h3 className="text-xl font-display font-bold text-on-surface leading-tight">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
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
                      <span className="text-lg font-display font-bold text-on-surface">${item.total.toFixed(2)}</span>
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

            <div className="relative">
              <input
                className="w-full bg-surface-container-high border-none text-sm text-on-surface px-4 py-3 focus:ring-0 focus:outline-none placeholder:text-outline transition-all pb-[10px] border-b-2 border-transparent focus:border-primary"
                placeholder="Access Code"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Shipping Calculation</span>
                <span className="font-medium text-on-surface">Calculated at next step</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-medium text-on-surface">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30"></div>

            <div className="flex justify-between items-end">
              <span className="text-sm font-bold tracking-[0.1em] text-on-surface-variant uppercase">Total Required</span>
              <span className="text-3xl font-display font-bold text-on-surface leading-none">${total.toFixed(2)}</span>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 px-6 rounded-lg font-bold tracking-wide uppercase text-sm hover:from-primary-container hover:to-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,72,225,0.3)] hover:shadow-[0_0_30px_rgba(0,72,225,0.5)] flex items-center justify-center gap-2">
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

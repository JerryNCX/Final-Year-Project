import React, { useState, useMemo } from 'react'
import { Minus, Plus, X, Lock, Truck, ShoppingCart as CartIcon, Cpu, CheckSquare, Square } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'
import { useCart } from '@/stores/CartContext'

export default function ShoppingCartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, subtotal, formatPrice } = useCart()
  const [selectedIds, setSelectedIds] = useState(() => new Set(cartItems.map(i => i.id)))

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const buildItems = cartItems.filter(i => i.from_build)
  const catalogItems = cartItems.filter(i => !i.from_build)

  const allBuildIds = useMemo(() => new Set(buildItems.map(i => i.id)), [buildItems])
  const allCatalogIds = useMemo(() => new Set(catalogItems.map(i => i.id)), [catalogItems])

  const buildAllSelected = buildItems.length > 0 && buildItems.every(i => selectedIds.has(i.id))
  const catalogAllSelected = catalogItems.length > 0 && catalogItems.every(i => selectedIds.has(i.id))

  const toggleItem = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleAllBuild = () => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      for (const id of allBuildIds) {
        if (buildAllSelected) next.delete(id); else next.add(id)
      }
      return next
    })
  }

  const toggleAllCatalog = () => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      for (const id of allCatalogIds) {
        if (catalogAllSelected) next.delete(id); else next.add(id)
      }
      return next
    })
  }

  const selectedItems = useMemo(() => cartItems.filter(i => selectedIds.has(i.id)), [cartItems, selectedIds])
  const selectedSubtotal = useMemo(() => selectedItems.reduce((s, i) => s + i.total, 0), [selectedItems])
  const selectedCount = selectedItems.reduce((s, i) => s + i.quantity, 0)

  const handleExecuteOrder = () => {
    if (selectedItems.length === 0) return
    navigate('/checkout', { state: { selectedItems } })
  }

  const Checkbox = ({ checked, onChange }) => (
    <button onClick={onChange} className="flex-shrink-0 text-on-surface-variant hover:text-primary transition-colors">
      {checked ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
    </button>
  )

  const renderCartItem = (item) => (
    <div
      key={item.id}
      className={`group bg-surface-container-lowest rounded-lg p-6 relative overflow-hidden transition-colors duration-300 hover:bg-surface-bright flex flex-col sm:flex-row gap-8 items-center border ${
        selectedIds.has(item.id) ? 'border-primary/30' : 'border-outline-variant/15'
      }`}
    >
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <Checkbox checked={selectedIds.has(item.id)} onChange={() => toggleItem(item.id)} />

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
  )

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased flex flex-col selection:bg-primary selection:text-on-primary">
      <Header />

      <main className="flex-grow max-w-[1920px] mx-auto w-full px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 mb-8">
          <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">ACTIVE MANIFEST</h1>
          <p className="text-on-surface-variant text-sm tracking-[0.05em] uppercase">
            {selectedCount} of {itemCount} item{itemCount !== 1 ? 's' : ''} selected
          </p>
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
          ) : (
            <>
              {buildItems.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox checked={buildAllSelected} onChange={toggleAllBuild} />
                    <Cpu className="w-5 h-5 text-primary" />
                    <h2 className="font-headline font-bold text-lg text-on-surface">Build Configuration</h2>
                    {buildAllSelected && buildItems.length > 0 && (
                      <span className="text-xs font-label text-primary bg-primary/10 px-2 py-0.5 rounded">All selected</span>
                    )}
                  </div>
                  <div className={`rounded-xl p-6 transition-colors ${buildAllSelected ? 'bg-primary-container/5 border border-primary/20' : 'bg-surface-container-low border border-outline-variant/15'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {buildItems.map(item => (
                        <div key={item.id} className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3" onClick={() => toggleItem(item.id)}>
                          <Checkbox checked={selectedIds.has(item.id)} onChange={() => toggleItem(item.id)} />
                          <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <CartIcon className="w-4 h-4 text-outline/40" />
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="font-label text-xs text-on-surface truncate">{item.name}</p>
                            <p className="font-label text-[10px] text-on-surface-variant">{item.category}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-label text-xs text-on-surface">{formatPrice(item.price)}</p>
                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id) }} className="text-on-surface-variant hover:text-error transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="font-label text-xs text-on-surface-variant">Build Total</span>
                      <span className="font-headline font-bold text-primary">{formatPrice(buildItems.reduce((s, i) => s + i.total, 0))}</span>
                    </div>
                  </div>
                </div>
              )}

              {catalogItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4 mt-2">
                    <Checkbox checked={catalogAllSelected} onChange={toggleAllCatalog} />
                    <CartIcon className="w-5 h-5 text-on-surface-variant" />
                    <h2 className="font-headline font-bold text-lg text-on-surface">Individual Components</h2>
                    {catalogAllSelected && catalogItems.length > 0 && (
                      <span className="text-xs font-label text-primary bg-primary/10 px-2 py-0.5 rounded">All selected</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {catalogItems.map(renderCartItem)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-container-lowest/70 backdrop-blur-[20px] rounded-lg p-8 border border-outline-variant/15 shadow-ambient flex flex-col gap-8">
            <h2 className="text-2xl font-display font-bold text-on-surface uppercase tracking-tight">Telemetry</h2>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Selected Items ({selectedCount})</span>
                <span className="font-medium text-on-surface">{formatPrice(selectedSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Shipping Calculation</span>
                <span className="font-medium text-on-surface">Calculated at next step</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30"></div>

            <div className="flex justify-between items-end">
              <span className="text-sm font-bold tracking-[0.1em] text-on-surface-variant uppercase">Total Required</span>
              <span className="text-3xl font-display font-bold text-on-surface leading-none">{formatPrice(selectedSubtotal)}</span>
            </div>

            <button
              onClick={handleExecuteOrder}
              disabled={selectedItems.length === 0}
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

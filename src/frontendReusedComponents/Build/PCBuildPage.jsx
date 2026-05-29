import React, { useState } from 'react'
import { Share2, Save, ShoppingBag, Edit, Trash2, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'

const initialComponents = {
  CPU: null,
  'CPU Cooler': null,
  Motherboard: null,
  'Video Card': null,
  Memory: null,
  Storage: null,
  'Power Supply': null,
  Case: null,
}

const componentData = {
  CPU: { name: 'AMD Ryzen 9 7950X3D', specs: '16-Core 4.2 GHz 120W TDP', price: 599.0 },
  Memory: { name: '64GB (2 x 32GB) DDR5-6000 CL30', specs: '', price: 289.99 },
}

export default function PCBuildPage() {
  const navigate = useNavigate()
  const [components, setComponents] = useState({
    CPU: componentData.CPU,
    'CPU Cooler': null,
    Motherboard: null,
    'Video Card': null,
    Memory: componentData.Memory,
    Storage: null,
    'Power Supply': null,
    Case: null,
  })

  const selectedCount = Object.values(components).filter(Boolean).length
  const totalPrice = Object.values(components).reduce((sum, c) => sum + (c ? c.price : 0), 0)

  const handleChoose = (category) => {
    navigate(`/build/choose/${category.toLowerCase().replace(/\s+/g, '-')}`)
  }

  const handleRemove = (category) => {
    setComponents(prev => ({ ...prev, [category]: null }))
  }

  const formatPrice = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      <Header />

      <div className="max-w-[1400px] mx-auto px-10 py-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-on-surface mb-2">SYSTEM BUILDER</h1>
            <p className="text-on-surface-variant text-base max-w-2xl">Configure your high-performance rig. All components are cross-referenced for compatibility and thermal tolerances.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
              <Share2 className="w-4 h-4" />
              Share Build
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-10">
          <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-label text-green-700 font-medium">Compatibility</span>
            <span className="text-sm font-label text-green-600">Verified</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-lg">
            <span className="text-sm font-label text-on-surface-variant">Est. Wattage</span>
            <span className="text-sm font-label text-on-surface font-bold">648W</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-lg">
            <span className="text-sm font-label text-on-surface-variant">Total Price</span>
            <span className="text-sm font-headline text-on-surface font-bold">{formatPrice(totalPrice)}</span>
          </div>
          <button className="ml-auto primary-gradient-btn flex items-center gap-2 px-8 py-2.5 text-on-primary font-label font-semibold rounded-lg hover:shadow-lg transition-all">
            <ShoppingBag className="w-4 h-4" />
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="ghost-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_200px_120px] gap-0 bg-surface-container-low border-b border-outline-variant/30">
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Component</div>
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Selection</div>
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Price</div>
          </div>

          {Object.entries(components).map(([category, selected]) => (
            <div key={category} className="grid grid-cols-[1fr_200px_120px] gap-0 border-b border-outline-variant/15 last:border-b-0 hover:bg-surface-container-low/40 transition-colors">
              <div className="px-8 py-5">
                <span className="font-headline font-bold text-on-surface">{category}</span>
                {selected && (
                  <div className="text-sm text-on-surface-variant mt-0.5">{selected.name} — {selected.specs}</div>
                )}
              </div>
              <div className="px-8 py-5 flex items-center justify-end">
                {selected ? (
                  <div className="flex gap-3">
                    <button onClick={() => handleChoose(category)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button onClick={() => handleRemove(category)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-error transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleChoose(category)} className="flex items-center gap-1.5 text-sm font-label text-primary hover:text-primary-fixed-dim transition-colors">
                    <Plus className="w-4 h-4" />
                    Choose
                  </button>
                )}
              </div>
              <div className="px-8 py-5 flex items-center justify-end">
                <span className="font-headline font-bold text-on-surface">
                  {selected ? formatPrice(selected.price) : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

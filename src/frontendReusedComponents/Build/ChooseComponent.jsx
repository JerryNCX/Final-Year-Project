import React, { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'

const sampleData = [
  { name: 'AMD Ryzen 9 7950X3D', cores: '16 / 32', clock: '4.2 / 5.7 GHz', socket: 'AM5', tdp: '120W', graphics: 'Radeon', price: 699.00 },
  { name: 'Intel Core i9-14900K', cores: '24 (8P+16E)', clock: '3.2 / 6.0 GHz', socket: 'LGA 1700', tdp: '125W', graphics: 'UHD 770', price: 589.99 },
  { name: 'AMD Ryzen 7 7800X3D', cores: '8 / 16', clock: '4.2 / 5.0 GHz', socket: 'AM5', tdp: '120W', graphics: 'Radeon', price: 374.49 },
]

export default function ChooseComponent() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('Performance: High to Low')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const titleMap = {
    cpu: 'Select Processor',
    gpu: 'Select Graphics Card',
    motherboard: 'Select Motherboard',
    memory: 'Select Memory',
    storage: 'Select Storage',
    'cpu-cooler': 'Select CPU Cooler',
    'power-supply': 'Select Power Supply',
    case: 'Select Case',
  }

  const title = titleMap[category] || 'Select Component'

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      <Header />

      <div className="max-w-[1920px] mx-auto flex">
        <aside className="hidden lg:block w-72 bg-surface-container-low p-8 flex-shrink-0 min-h-screen">
          <button onClick={() => navigate('/build')} className="flex items-center gap-2 text-sm font-label text-on-surface-variant hover:text-primary transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" />
            Back to System Builder
          </button>

          <h2 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface mb-6">Filters</h2>

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Component</h3>
            <div className="space-y-3">
              {['Processors', 'Motherboards', 'Memory'].map(label => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20" />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Brand</h3>
            <div className="space-y-3">
              {['AMD', 'Intel'].map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20"
                  />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Core Count</h3>
            <div className="space-y-3">
              {['6 Cores', '8 Cores', '12 Cores', '16+ Cores'].map(label => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20" />
                  <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                <input value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-full bg-surface-container-high text-on-surface text-sm pl-5 pr-2 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body" placeholder="100" type="number" />
              </div>
              <span className="text-on-surface-variant">-</span>
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                <input value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full bg-surface-container-high text-on-surface text-sm pl-5 pr-2 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body" placeholder="1000" type="number" />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-grow p-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface mb-1">{title}</h1>
              <p className="text-on-surface-variant text-sm">Showing 24 high-performance options for your build.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-on-surface-variant">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-container-high text-on-surface text-sm px-4 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body cursor-pointer appearance-none pr-8"
              >
                <option>Performance: High to Low</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="ghost-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px_120px_100px] gap-0 bg-surface-container-low border-b border-outline-variant/30">
              {['Product', 'Cores', 'Clock Speed', 'Socket', 'TDP', 'Graphics', 'Price', 'Action'].map(h => (
                <div key={h} className="px-6 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">{h === 'Action' ? '' : h}</div>
              ))}
            </div>
            {sampleData.map((item, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px_120px_100px] gap-0 border-b border-outline-variant/15 last:border-b-0 hover:bg-surface-container-low/40 transition-colors">
                <div className="px-6 py-4 flex items-center">
                  <span className="font-headline font-bold text-sm text-on-surface">{item.name}</span>
                </div>
                <div className="px-6 py-4 flex items-center text-sm text-on-surface-variant">{item.cores}</div>
                <div className="px-6 py-4 flex items-center text-sm text-on-surface-variant">{item.clock}</div>
                <div className="px-6 py-4 flex items-center text-sm text-on-surface-variant">{item.socket}</div>
                <div className="px-6 py-4 flex items-center text-sm text-on-surface-variant">{item.tdp}</div>
                <div className="px-6 py-4 flex items-center text-sm text-on-surface-variant">{item.graphics}</div>
                <div className="px-6 py-4 flex items-center justify-end text-sm font-headline font-bold text-on-surface">${item.price.toFixed(2)}</div>
                <div className="px-6 py-4 flex items-center justify-end">
                  <button
                    onClick={() => navigate('/build')}
                    className="primary-gradient-btn text-on-primary text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

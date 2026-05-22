import React, { useState, useEffect } from 'react'
import { Search, User, ShoppingCart, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Performance: High to Low')
  const itemsPerPage = 4

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('Product_Catalog')
          .select('*')
          .limit(50)
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const totalItems = products.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.03)] font-headline font-bold tracking-tight">
        <div className="flex items-center justify-between px-10 py-4 max-w-[1920px] mx-auto">
          <a href="/" className="text-xl font-black italic tracking-tighter text-slate-900">
            VOLTAGE PRECISION
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/catalog" className="text-primary border-b-2 border-primary pb-1 transition-all duration-300">Catalog</a>
            <a href="/builds" className="text-slate-600 font-medium hover:text-primary transition-all duration-300">Builds</a>
            <a href="/support" className="text-slate-600 font-medium hover:text-primary transition-all duration-300">Support</a>
            <a href="/about" className="text-slate-600 font-medium hover:text-primary transition-all duration-300">About</a>
          </nav>
          <div className="flex items-center gap-6 text-primary">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="bg-surface-container-high text-on-surface text-sm pl-9 pr-4 py-2 w-64 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body"
                placeholder="Search Components..."
                type="text"
              />
            </div>
            <button className="hover:text-primary transition-all duration-300">
              <User className="w-5 h-5" />
            </button>
            <a href="/cart" className="hover:text-primary transition-all duration-300 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-secondary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full font-body">3</span>
            </a>
          </div>
        </div>
        <div className="bg-slate-200/30 h-[1px] w-full"></div>
      </header>

      <main className="flex-grow flex w-full max-w-[1920px] mx-auto">
        <aside className="hidden lg:block w-80 bg-surface-container-low p-8 flex-shrink-0 min-h-[calc(100vh-80px)]">
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-2">Filters</h2>
            <p className="font-body text-sm text-on-surface-variant">Narrow down your technical specifications.</p>
          </div>

          <div className="mb-8">
            <h3 className="font-body text-sm font-semibold text-on-surface uppercase tracking-widest mb-6">Component Type</h3>
            <div className="space-y-4">
              {['Processors (CPU)', 'Graphics Cards (GPU)', 'Motherboards', 'Memory (RAM)', 'Storage (NVMe/SSD)'].map((label, i) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={i === 1}
                    className="h-5 w-5 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20 focus:ring-offset-0 transition-colors"
                  />
                  <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-body text-sm font-semibold text-on-surface uppercase tracking-widest mb-6">Brand</h3>
            <div className="space-y-4">
              {['NVIDIA', 'AMD', 'ASUS ROG', 'MSI'].map(label => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="h-5 w-5 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20 focus:ring-offset-0 transition-colors" />
                  <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-body text-sm font-semibold text-on-surface uppercase tracking-widest mb-6">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-body">$</span>
                <input className="w-full bg-surface-container-high text-on-surface text-sm pl-7 pr-3 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body" placeholder="Min" type="number" />
              </div>
              <span className="text-on-surface-variant font-body">-</span>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-body">$</span>
                <input className="w-full bg-surface-container-high text-on-surface text-sm pl-7 pr-3 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body" placeholder="Max" type="number" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-body text-sm font-semibold text-on-surface uppercase tracking-widest mb-6">Availability</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20 focus:ring-offset-0 transition-colors" />
                <span className="font-body text-sm text-on-surface group-hover:text-primary transition-colors">In Stock</span>
              </label>
            </div>
          </div>
        </aside>

        <section className="flex-grow p-8 lg:p-12 bg-surface">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Graphics Cards</h1>
              <p className="font-body text-base text-on-surface-variant max-w-xl">High-performance computational rendering engines for extreme workloads and framerates.</p>
            </div>
            <div className="flex items-center gap-4 self-end">
              <span className="font-body text-sm text-on-surface-variant">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-container-high text-on-surface text-sm px-4 py-2 rounded-sm border-none focus:ring-0 focus:outline-none focus:border-b-2 focus:border-b-primary transition-all font-body cursor-pointer appearance-none pr-8"
              >
                <option>Performance: High to Low</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant/15 rounded-sm p-6 animate-pulse">
                  <div className="h-64 bg-surface-container rounded-sm mb-4" />
                  <div className="h-4 bg-surface-container rounded w-1/3 mb-2" />
                  <div className="h-6 bg-surface-container rounded w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 bg-surface-container rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedProducts.map((product, idx) => (
                  <article
                    key={product.id || idx}
                    className="bg-surface-container-lowest ghost-border group relative overflow-hidden transition-colors duration-300 hover:bg-surface-bright flex flex-col h-full"
                  >
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-secondary text-on-primary font-body text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-bold">Extreme Perf</span>
                    </div>
                    <div className="relative h-64 w-full bg-surface-container flex items-center justify-center p-6 overflow-hidden">
                      {product.Image ? (
                        <img
                          src={product.Image}
                          alt={product.Product_name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-body text-sm">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <span className="font-body text-xs text-on-surface-variant uppercase tracking-[0.1em] mb-1 block">{product.Brand || 'Generic'}</span>
                        <h3 className="font-display text-xl font-bold tracking-tight text-on-surface leading-tight">{product.Product_name || 'Product Name'}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-auto pt-6">
                        <div>
                          <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider block mb-0.5">VRAM</span>
                          <span className="font-body text-sm font-semibold text-on-surface">{product.VRAM || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider block mb-0.5">Core Clock</span>
                          <span className="font-body text-sm font-semibold text-on-surface">{product.Core_Clock || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider block mb-0.5">Cores</span>
                          <span className="font-body text-sm font-semibold text-on-surface">{product.Cores || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider block mb-0.5">TDP</span>
                          <span className="font-body text-sm font-semibold text-on-surface">{product.TDP || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-container-high">
                        <div className="font-display text-2xl font-bold tracking-tight text-on-surface">
                          {product.Current_price ? `$${product.Current_price}` : '$0.00'}
                        </div>
                        <button className="primary-gradient-btn text-on-primary font-body text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                          Add
                          <Plus className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-16 flex items-center justify-between border-t border-surface-container-high pt-6">
                <span className="font-body text-sm text-on-surface-variant">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Items
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container-low text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-sm font-body text-sm font-bold transition-colors ${
                        page === currentPage
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-variant'
                      }`}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                  ))}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant font-body">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container-low text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="bg-slate-100 font-body text-xs uppercase tracking-[0.1em] w-full py-12 px-10 mt-auto">
        <div className="max-w-[1920px] mx-auto">
          <div className="bg-slate-300 h-[1px] mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <h4 className="text-lg font-black text-slate-900 mb-4 font-headline italic tracking-tighter normal-case">VOLTAGE PRECISION</h4>
              <p className="text-slate-500">© 2024 VOLTAGE PRECISION. ENGINEERED FOR MAXIMUM TOLERANCE.</p>
            </div>
            <nav className="flex flex-wrap gap-6 md:justify-end">
              <a href="#" className="text-slate-500 hover:text-primary underline decoration-2 underline-offset-4 transition-colors duration-200">Warranty</a>
              <a href="#" className="text-slate-500 hover:text-primary underline decoration-2 underline-offset-4 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-primary underline decoration-2 underline-offset-4 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-primary underline decoration-2 underline-offset-4 transition-colors duration-200">Shipping & Returns</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

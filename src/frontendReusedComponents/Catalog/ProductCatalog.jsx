import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { supabase } from '@/lib/supabase'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Performance: High to Low')
  const [showFilters, setShowFilters] = useState(false)
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

  const filterSections = [
    {
      label: 'COMPONENT TYPE',
      items: ['Processors (CPU)', 'Graphics Cards (GPU)', 'Motherboards', 'Memory (RAM)', 'Storage (NVMe/SSD)'],
    },
    {
      label: 'BRAND',
      items: ['NVIDIA', 'AMD', 'ASUS ROG', 'MSI'],
    },
    {
      label: 'AVAILABILITY',
      items: ['In Stock'],
    },
  ]

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Header />

      <main className="flex-grow flex w-full max-w-[1920px] mx-auto">
        {/* Filter sidebar — desktop */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 xl:w-80 bg-surface-container p-6 md:p-8 flex-shrink-0 min-h-[calc(100vh-80px)]`}>
          <div className="mb-8 pb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label text-[10px] text-primary tracking-[0.2em]">{'>'}</span>
              <h2 className="font-label text-xs tracking-[0.15em] uppercase text-on-surface">Filters</h2>
            </div>
            <p className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider">Narrow specifications</p>
          </div>

          {filterSections.map((section) => (
            <div key={section.label} className="mb-7">
              <h3 className="font-label text-[10px] tracking-[0.15em] uppercase text-primary mb-4">{section.label}</h3>
              <div className="space-y-3">
                {section.items.map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded-none border-outline/40 bg-surface-container-low text-primary focus:ring-primary/30 focus:ring-offset-0 transition-colors"
                    />
                    <span className="font-label text-xs text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-7">
            <h3 className="font-label text-[10px] tracking-[0.15em] uppercase text-primary mb-4">PRICE RANGE</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-label text-[10px]">$</span>
                <input className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] pl-5 pr-2 py-2 focus:outline-none focus:border-primary/50 transition-colors" placeholder="MIN" type="number" />
              </div>
              <span className="text-on-surface-variant/30 font-label text-[10px]">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-label text-[10px]">$</span>
                <input className="w-full bg-surface-container-low border border-outline/30 text-on-surface font-label text-[11px] pl-5 pr-2 py-2 focus:outline-none focus:border-primary/50 transition-colors" placeholder="MAX" type="number" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-grow p-6 md:p-8 lg:p-12 bg-surface-dim">
          {/* Header bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-1 block">{'>'} CATALOG</span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface uppercase">Graphics Cards</h1>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-1">High-performance computational rendering engines</p>
            </div>
            <div className="flex items-center gap-4 self-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden font-label text-[10px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-3 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3 h-3" />
                FILTERS
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-container border border-outline/30 text-on-surface font-label text-[11px] tracking-wider px-4 py-2.5 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none pr-8 uppercase"
              >
                <option>PERFORMANCE: HIGH TO LOW</option>
                <option>PRICE: HIGH TO LOW</option>
                <option>PRICE: LOW TO HIGH</option>
                <option>NEWEST ARRIVALS</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="trace-border bg-surface-container-lowest p-6 animate-pulse">
                  <div className="h-56 bg-surface-container mb-4" />
                  <div className="h-3 bg-surface-container w-1/3 mb-2" />
                  <div className="h-5 bg-surface-container w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-6 bg-surface-container" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} NO PRODUCTS FOUND</span>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-3">No items match the current criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {paginatedProducts.map((product, idx) => (
                  <Link
                    key={product.id || idx}
                    to={`/product/${product.id || product.ASIN}`}
                    className="trace-border bg-surface-container-lowest transition-all duration-300 hover:bg-surface-container group flex flex-col h-full"
                  >
                    <div className="relative h-56 bg-surface-container flex items-center justify-center p-6 overflow-hidden">
                      {product.Image ? (
                        <img
                          src={product.Image}
                          alt={product.Product_name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span className="font-headline text-5xl text-outline/20">{product.Product_name?.[0] || '?'}</span>
                      )}
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <div className="mb-3">
                        <span className="font-label text-[9px] text-primary tracking-[0.15em] uppercase">{product.Brand || 'GENERIC'}</span>
                        <h3 className="font-headline text-xl md:text-2xl tracking-tight text-on-surface leading-tight mt-0.5">
                          {product.Product_name || 'PRODUCT NAME'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-auto pt-4">
                        {[
                          { label: 'VRAM', value: product.VRAM },
                          { label: 'CORE CLOCK', value: product.Core_Clock },
                          { label: 'CORES', value: product.Cores },
                          { label: 'TDP', value: product.TDP },
                        ].map((spec) => (
                          <div key={spec.label}>
                            <div className="font-label text-[8px] text-on-surface-variant/50 tracking-[0.15em] uppercase">{spec.label}</div>
                            <div className="font-body text-[11px] text-on-surface">{spec.value || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-5 pt-4">
                        <span className="font-headline text-xl tracking-tight text-primary">
                          {product.Current_price ? `$${product.Current_price}` : '—'}
                        </span>
                        <span className="font-label text-[9px] tracking-[0.15em] uppercase text-on-surface-variant/50 group-hover:text-primary transition-colors">
                          VIEW &gt;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider order-2 md:order-1">
                  SHOWING {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} OF {totalItems} ITEMS
                </span>
                <div className="flex items-center gap-2 order-1 md:order-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center font-label text-xs tracking-wider transition-colors ${
                        page === currentPage
                          ? 'bg-primary text-on-primary'
                          : 'border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50'
                      }`}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                  ))}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="w-9 h-9 flex items-center justify-center font-label text-xs text-on-surface-variant/40">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center border border-outline/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

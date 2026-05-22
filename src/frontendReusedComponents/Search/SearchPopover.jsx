import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Camera, SlidersHorizontal } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function SearchPopover({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('Product_Catalog')
          .select('*')
          .ilike('Product_name', `%${query}%`)
          .limit(8)
        setResults(data || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    const num = parseFloat(price.toString().replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return price
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-20 px-6 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-5xl glass-panel rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
        <div className="p-8 border-b border-outline-variant/30 flex items-center gap-6">
          <div className="flex-1 flex items-center gap-4 bg-surface-container-high/50 rounded-lg px-6 py-4 border-b-2 border-primary">
            <Search className="w-6 h-6 text-primary" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-2xl font-headline font-medium placeholder:text-outline"
              placeholder="Search by model, SKU, or performance tier..."
            />
            <button onClick={onClose} className="p-2 hover:bg-surface-container-highest rounded-full transition-all">
              <X className="w-5 h-5 text-outline" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          <div className="w-2/5 border-r border-outline-variant/30 bg-surface-container-low/40 p-8 flex flex-col gap-10 overflow-y-auto">
            <div>
              <h3 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
                Visual Identification
              </h3>
              <div
                onClick={() => navigate('/catalog')}
                className="border-2 border-dashed border-outline-variant bg-surface/50 rounded-xl p-10 flex flex-col items-center text-center group cursor-pointer hover:border-primary transition-colors"
              >
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-6 text-on-primary-container group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <p className="font-headline text-lg font-bold mb-2">Drop hardware photo here</p>
                <p className="text-sm text-outline px-4 leading-relaxed">
                  Drag and drop or upload a component photo to find exact matches and technical specs.
                </p>
                <a
                  href="/catalog"
                  className="mt-6 px-6 py-2 bg-on-surface text-surface text-xs font-bold rounded-lg uppercase tracking-wider"
                >
                  Browse Catalog
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-outline mb-4">
                Filter Parameters
              </h3>
              <div className="flex flex-wrap gap-2">
                {['GPU', 'CPU', 'Motherboard', 'RAM', 'SSD', 'PSU'].map((cat) => (
                  <a
                    key={cat}
                    href={`/category/${cat.toLowerCase()}`}
                    className="px-3 py-1.5 bg-surface-bright border border-outline-variant rounded-md text-xs font-semibold hover:border-primary cursor-pointer transition-all"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-outline">
                Search Results {query ? `(${results.length})` : ''}
              </h3>
              {results.length > 0 && (
                <a href={`/catalog?q=${encodeURIComponent(query)}`} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline transition-all">
                  View All Results
                </a>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.slice(0, 4).map((product, index) => (
                  <div
                    key={`${product.ASIN}-${index}`}
                    onClick={() => { navigate(`/product/${product.id || product.ASIN}`); onClose() }}
                    className="group flex gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer"
                  >
                    <div className="w-32 h-32 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.Image ? (
                        <img src={product.Image} alt={product.Product_name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="text-outline text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">
                          {product.Product_name?.length > 50 ? product.Product_name.substring(0, 50) + '...' : product.Product_name}
                        </h4>
                        <span className="font-headline text-xl font-bold text-on-surface">{formatPrice(product.Current_price)}</span>
                      </div>
                      <p className="text-sm text-outline mb-4">{product.category || 'Component'}</p>
                      <div className="flex items-center gap-6">
                        {product.Stars && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-outline">
                              Rating: {product.Stars}
                            </span>
                          </div>
                        )}
                        <div className="ml-auto">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase rounded">
                            In Stock
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-16 text-outline">
                <p className="font-headline text-lg">No results found</p>
                <p className="text-sm mt-2">Try different keywords or browse categories</p>
              </div>
            ) : (
              <div className="text-center py-16 text-outline">
                <p className="font-headline text-lg">Start typing to search</p>
                <p className="text-sm mt-2">Search across thousands of components</p>
              </div>
            )}

            {!query && results.length === 0 && (
              <>
                <div className="mt-8 pt-8 border-t border-outline-variant/30">
                  <h3 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-outline mb-6">
                    Technical Collections
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="/catalog" className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-primary/10 transition-colors group cursor-pointer">
                      <span className="font-headline font-bold text-on-surface">High-Performance GPUs</span>
                      <span className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-lg">→</span>
                    </a>
                    <a href="/category/cpu" className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-primary/10 transition-colors group cursor-pointer">
                      <span className="font-headline font-bold text-on-surface">Workstation CPUs</span>
                      <span className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-lg">→</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-surface-container-highest px-8 py-4 flex items-center justify-between">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] font-bold border border-outline-variant">ESC</kbd>
              <span className="text-xs text-outline font-medium">to close</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] font-bold border border-outline-variant">↑↓</kbd>
              <span className="text-xs text-outline font-medium">to navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] font-bold border border-outline-variant">ENTER</kbd>
              <span className="text-xs text-outline font-medium">to select</span>
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
            Precision Indexing v4.2.0
          </div>
        </div>
      </div>

      <button onClick={onClose} className="mt-8 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
        <span className="text-sm">×</span>
        Click outside to return to atelier
      </button>
    </div>
  )
}

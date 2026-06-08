import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { searchProducts } from '@/lib/api'
import { CATEGORIES } from '@/lib/categories'

function getFirstImage(urls) {
  if (!urls) return null
  try {
    const parsed = JSON.parse(urls)
    return Array.isArray(parsed) ? parsed[0] : null
  } catch {
    return urls || null
  }
}

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const decodedCategory = decodeURIComponent(category)
  const isValidCategory = CATEGORIES.includes(decodedCategory)

  useEffect(() => {
    if (!isValidCategory) {
      setError('Invalid category')
      setLoading(false)
      return
    }
    async function loadProducts() {
      setLoading(true)
      setError(null)
      try {
        const res = await searchProducts({ category: decodedCategory, limit: 50 })
        setProducts(res.results || [])
        if ((res.results || []).length === 0) setError('No products found')
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [decodedCategory, isValidCategory])

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-surface-dim">
        <div className="max-w-[1920px] mx-auto px-6 md:px-10">
          <Header />
          <div className="py-20 text-center">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} ERROR</span>
            <h1 className="font-headline text-4xl tracking-tight text-on-surface uppercase mt-3">Category Not Found</h1>
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-2">The category &ldquo;{decodedCategory}&rdquo; does not exist.</p>
            <Link to="/" className="inline-block mt-8 bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary-container transition-colors">
              RETURN HOME
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface font-body">
      <div className="max-w-[1920px] mx-auto px-6 md:px-10 space-y-8 md:space-y-10">
        <Header />

        <div className="space-y-4 pt-4">
          <Link to="/catalog" className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" />
            ALL CATALOG
          </Link>
          <div>
            <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-1 block">{'>'} COMPONENT SERIES</span>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface uppercase">
              {decodedCategory}
            </h1>
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-1">
              Browse our selection of {decodedCategory} products
            </p>
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <div className="w-5 h-5 border border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Loading...</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-16 text-center">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} {error}</span>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} EMPTY</span>
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-3">No products found in this category.</p>
            <Link to="/catalog" className="inline-block mt-6 font-label text-[10px] tracking-[0.15em] uppercase text-primary border-b border-primary/50 hover:border-primary transition-colors">
              BROWSE ALL CATALOG
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 pb-16">
            {products.map((product, index) => {
              const imageUrl = getFirstImage(product.image_urls)
              return (
                <Link
                  key={`${product.table_name}-${product.id}-${index}`}
                  to={`/product/${product.table_name}/${product.id}`}
                  className="group trace-border bg-surface-container-lowest p-4 transition-all duration-300 hover:bg-surface-container flex flex-col gap-3"
                >
                  <div className="bg-surface-container aspect-square flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="font-headline text-4xl text-outline/20">{decodedCategory[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="font-label text-[11px] leading-snug line-clamp-2 text-on-surface group-hover:text-primary transition-colors uppercase tracking-wider">
                      {product.name || 'Unknown Product'}
                    </h3>
                    {product.price && (
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-lg tracking-tight text-primary">
                          {product.price}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-auto pt-2 font-label text-[11px] text-on-surface-variant/60 uppercase tracking-wider">
                      {product.manufacturer && (
                        <span>{product.manufacturer}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-label text-[11px] tracking-[0.15em] uppercase text-on-surface-variant/50 group-hover:text-primary transition-all">
                    <span>VIEW</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}

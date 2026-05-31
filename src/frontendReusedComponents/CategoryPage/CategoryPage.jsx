import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { fetchProductsByCategory, CATEGORIES } from '@/lib/supabase'

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const decodedCategory = decodeURIComponent(category)
  const isValidCategory = CATEGORIES.includes(decodedCategory)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProductsByCategory(decodedCategory, 50)
        setProducts(data)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isValidCategory) {
      loadProducts()
    } else {
      setError('Invalid category')
      setLoading(false)
    }
  }, [decodedCategory, isValidCategory])

  function extractShortName(fullName) {
    if (!fullName) return 'Unknown Product'
    const cleaned = fullName
      .replace(/^SponsoredSponsored You're seeing this ad based on the product's relevance to your search query\.Let us know /g, '')
      .replace(/Sponsored /g, '')
      .substring(0, 80)
    return cleaned + (fullName.length > 80 ? '...' : '')
  }

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

        {error && (
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
            {products.map((product, index) => (
              <Link
                key={`${product.ASIN}-${index}`}
                to={`/product/${product.id || product.ASIN}`}
                className="group trace-border bg-surface-container-lowest p-4 transition-all duration-300 hover:bg-surface-container flex flex-col gap-3"
              >
                <div className="bg-surface-container aspect-square flex items-center justify-center overflow-hidden">
                  {product.Image ? (
                    <img
                      src={product.Image}
                      alt={product.Product_name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span className="font-headline text-4xl text-outline/20">{decodedCategory[0]}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-label text-[11px] leading-snug line-clamp-2 text-on-surface group-hover:text-primary transition-colors uppercase tracking-wider">
                    {extractShortName(product.Product_name)}
                  </h3>
                  {product.Current_price && (
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-lg tracking-tight text-primary">
                        ${product.Current_price}
                      </span>
                      {product.Original_price && product.Original_price !== product.Current_price && (
                        <span className="font-label text-[9px] text-on-surface-variant/50 line-through">
                          ${product.Original_price}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-auto pt-2 font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider">
                    {product.Stars && (
                      <>
                        <span className="text-primary">{product.Stars}</span>
                        {product.Rating_count && <span>({product.Rating_count})</span>}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-label text-[9px] tracking-[0.15em] uppercase text-on-surface-variant/50 group-hover:text-primary transition-all">
                  <span>VIEW</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}

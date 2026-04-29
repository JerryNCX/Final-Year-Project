import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { fetchProductsByCategory, CATEGORIES } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

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

  function formatPrice(price) {
    if (!price) return 'N/A'
    return price
  }

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
      <div className="min-h-screen bg-background">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="py-10 text-center">
            <h1 className="text-2xl font-semibold">Category Not Found</h1>
            <p className="text-muted-foreground mt-2">The category "{decodedCategory}" does not exist.</p>
            <Button asChild className="mt-4">
              <a href="/">Go to Homepage</a>
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Header />
        
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-500">Our Product</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{decodedCategory}</h1>
          <p className="text-muted-foreground">
            Browse our selection of {decodedCategory} products
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product, index) => (
              <article
                key={`${product.ASIN}-${index}`}
                className="group border rounded-xl p-3 sm:p-4 bg-background hover:shadow-md transition flex flex-col gap-3"
              >
                <div className="relative rounded-lg bg-muted aspect-square overflow-hidden flex items-center justify-center">
                  {product.Image ? (
                    <img 
                      src={product.Image} 
                      alt={product.Product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <span className="text-xs text-muted-foreground hidden">Product image</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                    {extractShortName(product.Product_name)}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{formatPrice(product.Current_price)}</span>
                    {product.Original_price && product.Original_price !== product.Current_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.Original_price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{product.Stars}</span>
                    <span>({product.Rating_count})</span>
                  </div>
                </div>
                <Button size="sm" className="mt-auto">
                  View Details
                </Button>
              </article>
            ))}
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
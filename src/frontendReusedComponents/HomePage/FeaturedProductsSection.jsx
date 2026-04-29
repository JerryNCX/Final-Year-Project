import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { fetchFeaturedProducts } from '@/lib/supabase'

function calculateDiscount(current, original) {
  if (!current || !original) return null
  const currentNum = parseFloat(current.replace(/[^0-9.]/g, ''))
  const originalNum = parseFloat(original.replace(/[^0-9.]/g, ''))
  if (!currentNum || !originalNum || originalNum <= currentNum) return null
  const discount = Math.round(((originalNum - currentNum) / originalNum) * 100)
  return `-${discount}%`
}

function formatPrice(price) {
  if (!price) return 'N/A'
  return price
}

function extractShortName(fullName) {
  if (!fullName) return 'Unknown Product'
  const cleaned = fullName
    .replace(/^SponsoredSponsored You're seeing this ad based on the product's relevance to your search query\.Let us know /g, '')
    .replace(/Sponsored /g, '')
    .substring(0, 60)
  return cleaned + (fullName.length > 60 ? '...' : '')
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchFeaturedProducts(8)
        setProducts(data)
      } catch (err) {
        console.error('Error loading featured products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <section className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block h-8 w-1 rounded-full bg-red-500 align-middle mr-2" />
          <span className="text-sm font-semibold text-red-500 align-middle">Today&apos;s</span>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">Flash Sales</h2>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
          <Link to="/category/CPU">View All Products</Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-xl p-3 sm:p-4 bg-background animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => {
            const discount = calculateDiscount(product.Current_price, product.Original_price)
            return (
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
                  {discount && (
                    <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
                      {discount}
                    </span>
                  )}
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
                  Add to cart
                </Button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
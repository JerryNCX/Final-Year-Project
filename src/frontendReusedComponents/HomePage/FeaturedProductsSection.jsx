import React from 'react'
import { Button } from '@/components/ui/button'

const PRODUCTS = [
  { id: 1, name: 'Gaming Laptop Pro 15"', price: '$1,499', oldPrice: '$1,799', badge: '-17%' },
  { id: 2, name: 'UltraWide Monitor 34"', price: '$799', oldPrice: '$899', badge: '-11%' },
  { id: 3, name: 'Mechanical Keyboard RGB', price: '$129', oldPrice: '$159', badge: '-19%' },
  { id: 4, name: 'Wireless Gaming Mouse', price: '$79', oldPrice: '$99', badge: '-20%' },
  { id: 5, name: 'Streaming Headset', price: '$149', oldPrice: '$179', badge: '-17%' },
  { id: 6, name: 'Desk Microphone', price: '$99', oldPrice: '$129', badge: '-23%' },
  { id: 7, name: 'Ergonomic Chair', price: '$349', oldPrice: '$399', badge: '-13%' },
  { id: 8, name: 'RGB Light Strip', price: '$39', oldPrice: '$49', badge: '-20%' },
]

export default function FeaturedProductsSection() {
  return (
    <section className="space-y-4 pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block h-8 w-1 rounded-full bg-red-500 align-middle mr-2" />
          <span className="text-sm font-semibold text-red-500 align-middle">Today&apos;s</span>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold">Flash Sales</h2>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          View All Products
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {PRODUCTS.map((product) => (
          <article
            key={product.id}
            className="group border rounded-xl p-3 sm:p-4 bg-background hover:shadow-md transition flex flex-col gap-3"
          >
            <div className="relative rounded-lg bg-muted aspect-square overflow-hidden flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Product image</span>
              <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
                {product.badge}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm sm:text-base font-medium line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{product.price}</span>
                <span className="text-xs text-muted-foreground line-through">{product.oldPrice}</span>
              </div>
            </div>
            <Button size="sm" className="mt-auto">
              Add to cart
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}


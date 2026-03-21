import React from 'react'
import { Button } from '@/components/ui/button'

const SIDE_CATEGORIES = [
  "Woman's Fashion",
  "Men's Fashion",
  'Electronics',
  'Home & Lifestyle',
  'Medicine',
  'Sports & Outdoor',
  "Baby's & Toys",
  'Groceries & Pets',
  'Health & Beauty',
]

export default function HeroSection() {
  return (
    <section className="py-6">
      <div className="grid gap-6 md:grid-cols-[260px,minmax(0,1fr)] md:items-stretch">
        <aside className="hidden md:block border-r pr-4">
          <ul className="space-y-2 text-sm">
            {SIDE_CATEGORIES.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between py-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span>{item}</span>
                <span className="text-xs">{'>'}</span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="space-y-4">
          <div className="relative w-full bg-black rounded-lg overflow-hidden">
            <div className="flex flex-col gap-4 px-8 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16 text-white max-w-xl">
              <span className="text-sm text-red-400 font-medium">iPhone 14 Series</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Up to 10% <br className="hidden sm:block" />
                off Voucher
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-md">
                Shop the latest Apple devices and accessories with exclusive vouchers this season.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-fit border-white text-black hover:bg-white hover:text-bold"
              >
                Shop Now
              </Button>
            </div>
            {/* placeholder right side image area */}
            <div className="absolute inset-y-0 right-0 w-1/2 hidden sm:block">
              <div className="h-full w-full bg-gradient-to-t from-fuchsia-500 via-purple-500 to-slate-900" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === 2 ? 'w-6 bg-red-500' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


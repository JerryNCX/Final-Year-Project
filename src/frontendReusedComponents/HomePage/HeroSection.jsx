import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/supabase'

export default function HeroSection() {
  const handleCategoryClick = (category) => {
    window.location.href = `/category/${encodeURIComponent(category)}`
  }

  return (
    <section className="py-6">
      <div className="grid gap-6 md:grid-cols-[260px,minmax(0,1fr)] md:items-stretch">
        <aside className="hidden md:block border-r pr-4">
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((item) => (
              <li
                key={item}
                onClick={() => handleCategoryClick(item)}
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
              <span className="text-sm text-red-400 font-medium">PC Components</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Build Your <br className="hidden sm:block" />
                Dream PC
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-md">
                Shop the latest CPUs, GPUs, Motherboards and more with exclusive discounts.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-fit border-white text-black hover:bg-white hover:text-bold"
                asChild
              >
                <Link to="/category/CPU">Shop Now</Link>
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 hidden sm:block">
              <div className="h-full w-full bg-gradient-to-t from-blue-600 via-purple-600 to-slate-900" />
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
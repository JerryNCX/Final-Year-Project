import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '@/lib/supabase'

const CATEGORY_ICONS = {
  'CPU': '⚡',
  'CPU Cooler': '❄️',
  'GPU': '🎮',
  'Motherboard': '🔲',
  'PC Case': '🖥️',
  'PSU': '🔌',
  'RAM': '💾',
  'SSD': '💿'
}

export default function CategorySection() {
  return (
    <section className="space-y-4 pt-8">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold">Core Inventories</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto md:mx-0">
          Browse our selection of PC components for your build.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-6 lg:gap-6">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            to={`/category/${encodeURIComponent(category)}`}
            className="rounded-lg p-4 sm:p-5 text-sm font-medium text-center border transition bg-background hover:bg-accent hover:text-accent-foreground block"
          >
            <span className="text-2xl block mb-2">{CATEGORY_ICONS[category] || '📦'}</span>
            {category}
          </Link>
        ))}
      </div>
    </section>
  )
}
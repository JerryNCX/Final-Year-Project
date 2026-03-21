import React from 'react'

const CATEGORIES = [
  { name: 'Phones', active: false },
  { name: 'Computers', active: false },
  { name: 'SmartWatch', active: false },
  { name: 'Camera', active: true },
  { name: 'HeadPhones', active: false },
  { name: 'Gaming', active: false },
]

export default function CategorySection() {
  return (
    <section className="space-y-4 pt-8">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold">Browse by Category</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto md:mx-0">
          Find exactly what you need to upgrade your workspace or gaming setup.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-6 lg:gap-6">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            className={`rounded-lg p-4 sm:p-5 text-sm font-medium text-center border transition ${
              category.active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  )
}


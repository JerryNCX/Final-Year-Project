import React from 'react'

export default function CategorySidebar({ categories, selectedCategory, onSelectCategory, counts, totalCount }) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3 font-label">
        Categories
      </h3>
      <nav className="space-y-1">
        <button
          onClick={() => onSelectCategory('All')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium transition-colors font-label ${
            selectedCategory === 'All'
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span>All Products</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedCategory === 'All' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {totalCount}
          </span>
        </button>

        {categories.map((category) => {
          const count = counts[category] || 0
          const isSelected = selectedCategory === category
          
          if (count === 0) return null
          
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium transition-colors font-label ${
                isSelected
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
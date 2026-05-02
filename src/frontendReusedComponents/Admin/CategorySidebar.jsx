import React from 'react'

export default function CategorySidebar({ categories, selectedCategory, onSelectCategory, counts, totalCount }) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Categories
      </h3>
      <nav className="space-y-1">
        <button
          onClick={() => onSelectCategory('All')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>All Products</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedCategory === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
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
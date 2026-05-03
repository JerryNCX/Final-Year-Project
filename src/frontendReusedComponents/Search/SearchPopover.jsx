import React, { useState } from 'react'
import { Search, X, Image, Type, SlidersHorizontal } from 'lucide-react'
import TextSearchTab from './TextSearchTab'
import ImageSearchTab from './ImageSearchTab'

export default function SearchPopover({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('text')
  const [showFilters, setShowFilters] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="text-lg font-semibold">Search Products</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'text'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="w-4 h-4" />
            Text Search
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'image'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="w-4 h-4" />
            Image Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ml-auto ${
              showFilters
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'text' ? (
            <TextSearchTab showFilters={showFilters} />
          ) : (
            <ImageSearchTab showFilters={showFilters} />
          )}
        </div>
      </div>
    </div>
  )
}
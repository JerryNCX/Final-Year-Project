import React, { useState } from 'react'
import { Search, ShoppingCart, X } from 'lucide-react'
import SearchPopover from '../Search/SearchPopover'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  
  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-slate-50/70 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center h-16 px-8 max-w-[1920px] mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-slate-900 font-headline uppercase">
            <a href="/">TECH ATELIER</a>
          </div>
          <nav className="hidden md:flex items-center space-x-10 font-headline tracking-tight">
            <a href="/" className="text-blue-700 border-b-2 border-blue-600 pb-1">Home</a>
            <a href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
            <a href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-6">
            <div className="relative flex items-center bg-surface-container-high rounded-sm px-3 py-1.5">
              <Search className="w-4 h-4 text-on-surface-variant mr-2" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm p-0 w-48 placeholder:text-on-surface-variant/50"
                placeholder="Search Components"
                onFocus={() => setShowSearch(true)}
              />
            </div>
            <a href="/cart" className="relative hover:bg-slate-100/50 p-2 rounded-sm transition-all">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </a>
            <a href="/signup" className="bg-primary text-on-primary px-6 py-2 text-sm font-medium rounded-lg hover:shadow-lg transition-all">
              Sign Up
            </a>
          </div>
        </div>
      </header>
      <SearchPopover isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}

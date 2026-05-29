import React, { useState } from 'react'
import { Search, ShoppingCart, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import SearchPopover from '../Search/SearchPopover'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center h-16 px-8 max-w-[1920px] mx-auto">
          <div className="text-xl font-bold tracking-tighter text-on-surface font-headline uppercase">
            <a href="/">PRECISION TECH</a>
          </div>
          <nav className="hidden md:flex items-center space-x-10 font-headline tracking-tight">
            <a href="/" className="text-primary border-b-2 border-primary pb-1">Home</a>
            <a href="/catalog" className="text-on-surface-variant hover:text-on-surface transition-colors">Catalog</a>
            <a href="/build" className="text-on-surface-variant hover:text-on-surface transition-colors">Build</a>
            <a href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors">About</a>
            <a href="/contact" className="text-on-surface-variant hover:text-on-surface transition-colors">Support</a>
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
            <a href="/cart" className="relative hover:bg-surface-container-high p-2 rounded-sm transition-all">
              <ShoppingCart className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </a>
            {isAuthenticated ? (
              <a href="/account" className="hover:bg-surface-container-high p-2 rounded-sm transition-all">
                <User className="w-5 h-5 text-on-surface-variant" />
              </a>
            ) : (
              <a href="/signup" className="bg-primary text-on-primary px-6 py-2 text-sm font-medium rounded-lg hover:shadow-lg transition-all">
                Sign Up
              </a>
            )}
          </div>
        </div>
      </header>
      <SearchPopover isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}

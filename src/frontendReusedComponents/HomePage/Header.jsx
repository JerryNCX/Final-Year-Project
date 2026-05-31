import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react'

export default function Header({ cartCount = 0, searchQuery = '', setSearchQuery, onSearch }) {
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const searchRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showSearch])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/build', label: 'Build' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Support' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface-dim/95' : 'bg-surface-dim/80'} backdrop-blur-xl`}>
      <div className="flex items-center justify-between px-4 md:px-10 py-3 max-w-[1920px] mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-headline text-3xl md:text-4xl tracking-wide text-on-surface group-hover:text-primary transition-colors duration-300">
            PRECISION TECH
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-label text-xs uppercase tracking-[0.15em] py-1 transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-primary amber-glow-text border-b border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-on-surface-variant hover:text-primary transition-colors p-1"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-primary transition-colors p-1"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link to="/cart" className="relative text-on-surface-variant hover:text-primary transition-colors p-1">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[10px] font-bold font-label min-w-[18px] h-[18px] flex items-center justify-center rounded-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <Link to="/login" className="hidden md:block text-on-surface-variant hover:text-primary transition-colors p-1">
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-1"
            aria-label="Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="border-t border-outline/20">
          <div className="px-4 md:px-10 py-3 max-w-[1920px] mx-auto">
            <div className="relative max-w-2xl">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-label text-xs uppercase tracking-widest pointer-events-none select-none">
                {'>'}
              </span>
              <input
                ref={searchRef}
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearch) {
                    onSearch(searchQuery)
                    setShowSearch(false)
                  }
                  if (e.key === 'Escape') setShowSearch(false)
                }}
                className="w-full bg-surface-container border border-outline/30 text-on-surface font-body text-sm px-8 py-2.5 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/40 uppercase tracking-wider"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30 font-label text-[10px] tracking-widest">
                [ESC]
              </span>
            </div>
          </div>
        </div>
      )}

      {showMobileMenu && (
        <div className="md:hidden border-t border-outline/20 bg-surface-dim">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMobileMenu(false)}
                className={`block font-label text-sm uppercase tracking-[0.15em] py-3 px-4 transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/5 border-l-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

    </header>
  )
}

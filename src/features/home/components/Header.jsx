import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Sun, Moon, LogOut, UserCircle2 } from 'lucide-react'
import SearchPopover from '@/features/catalog/components/SearchPopover'
import { CartContext } from '@/stores/CartContext'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Header() {
  const cartCtx = useContext(CartContext)
  const cartCount = cartCtx?.cartCount ?? 0
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [showSearchPopover, setShowSearchPopover] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const dropdownRef = useRef(null)

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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleLogout = async () => {
    await logout()
    setShowUserDropdown(false)
    navigate('/')
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
            onClick={() => setShowSearchPopover(true)}
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

          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-surface-container-low border border-outline-variant rounded-lg shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant/30">
                    <p className="font-label text-xs text-on-surface-variant truncate">{user?.email || ''}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4" />
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={`/login${location.pathname !== '/login' && location.pathname !== '/signup' ? `?redirect=${encodeURIComponent(location.pathname + location.search)}` : ''}`}
                className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="font-label text-xs uppercase tracking-[0.15em] bg-primary text-on-primary px-4 py-1.5 rounded-lg hover:opacity-90 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-1"
            aria-label="Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

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
            <hr className="border-outline-variant/30 my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setShowMobileMenu(false)}
                  className="block font-label text-sm uppercase tracking-[0.15em] py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  My Account
                </Link>
                <button
                  onClick={() => { handleLogout(); setShowMobileMenu(false) }}
                  className="block w-full text-left font-label text-sm uppercase tracking-[0.15em] py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/login${location.pathname !== '/login' && location.pathname !== '/signup' ? `?redirect=${encodeURIComponent(location.pathname + location.search)}` : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="block font-label text-sm uppercase tracking-[0.15em] py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setShowMobileMenu(false)}
                  className="block font-label text-sm uppercase tracking-[0.15em] py-3 px-4 text-primary hover:text-primary-fixed-dim"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      <SearchPopover isOpen={showSearchPopover} onClose={() => setShowSearchPopover(false)} />
    </header>
  )
}

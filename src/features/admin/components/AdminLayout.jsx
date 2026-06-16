import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Package, ClipboardList, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const currentPath = location.pathname

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ClipboardList },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface font-body antialiased">
      <nav className="bg-surface-container-lowest ghost-border">
        <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-lg font-bold text-on-surface font-headline">
                <span>PRECISION TECH</span>
              </Link>
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
                <span className="text-sm text-on-surface-variant font-label">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-label"
              >
                View Store
              </Link>
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant font-label">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-error hover:text-on-error transition-colors font-label"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-surface-container-lowest ghost-border p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors font-label ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
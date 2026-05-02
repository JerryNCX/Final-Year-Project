import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Package, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const currentPath = location.pathname

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span>TECH ATELIER</span>
              </Link>
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Store
              </Link>
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
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
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
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
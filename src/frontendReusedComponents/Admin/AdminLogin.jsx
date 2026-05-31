import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/admin/products')
    } else {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface font-body antialiased flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-sm ghost-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-on-surface font-headline">Admin Login</h1>
            <p className="text-on-surface-variant mt-2 font-label">Sign in to manage your products</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container border border-error/20 text-on-error-container px-4 py-3 rounded-sm text-sm font-label">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-2 font-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 ghost-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container placeholder:text-outline text-on-surface"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-on-surface-variant mb-2 font-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 ghost-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container placeholder:text-outline text-on-surface"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 primary-gradient-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-primary hover:text-primary-container transition-colors flex items-center justify-center gap-1 font-label">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
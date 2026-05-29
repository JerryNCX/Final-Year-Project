import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, LogIn, Activity } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Authentication failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col justify-center px-16 py-12 bg-background">
        <div className="text-xl font-bold tracking-tighter text-on-surface font-headline uppercase mb-16">
          PRECISION TECH
        </div>
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-headline font-semibold text-on-background mb-2">
            Access Lab
          </h1>
          <p className="text-on-surface-variant font-body text-sm mb-8">
            Enter your credentials to access the performance engineering suite. Unauthorized access is monitored.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error-container border border-outline-variant text-on-error-container px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-label font-medium text-on-surface mb-2">
                Authentication ID (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="mail"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-sm font-label font-medium text-on-surface">
                  Security Key (Password)
                </label>
                <Link to="/login" className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors">
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-high rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="lock"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-sm text-primary border-outline-variant bg-surface-container-highest focus:ring-primary/20 focus:ring-offset-0"
              />
              <span className="text-xs font-label text-on-surface-variant">Maintain persistent session</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="primary-gradient-btn w-full flex items-center justify-center gap-2 px-4 py-3 text-on-primary font-label font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 animate-pulse" />
                  Initializing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Initialize Session
                </span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-xs font-label text-on-surface-variant">
                <span className="bg-background px-2">or connect via</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-label text-on-surface-variant">
            Require engineering access?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-fixed-dim font-medium">
              Request Account
            </Link>
          </p>
        </div>
      </div>

      <div className="w-1/2 relative overflow-hidden bg-[#0a0a1a]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234286f4\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,76,237,0.15) 50%, rgba(0,76,237,0.3) 100%)'
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-label text-blue-300 uppercase tracking-widest">System Metrics</span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-label text-blue-200">Thermal Delta</span>
                    <span className="font-label text-green-400">-2.4&deg;C</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[55%] bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-label text-blue-200">Clock Stability</span>
                    <span className="font-label text-green-400">99.9%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[99%] bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 glass-panel rounded-full px-4 py-2 border border-green-500/20 w-fit mx-auto">
              <span className="text-xs font-label text-green-300 uppercase tracking-wider">Access Authorized</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

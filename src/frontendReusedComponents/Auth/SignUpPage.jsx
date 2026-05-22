import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, User, Mail, Lock, Check, Github } from 'lucide-react'

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions')
      return
    }
    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    if (signUpError) {
      setError(signUpError.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-[45%] flex flex-col justify-center px-14 py-12 bg-background">
        <div className="text-xl font-bold tracking-tighter text-primary font-headline uppercase mb-12">
          PRECISION TECH
        </div>
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-headline font-semibold text-on-background mb-1">
            CREATE ACCOUNT
          </h1>
          <p className="text-on-surface-variant font-body text-sm mb-7">
            Set up your engineering workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-error-container border border-outline-variant text-on-error-container px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-xs font-label font-medium text-on-surface mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-xs font-label font-medium text-on-surface mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-label font-medium text-on-surface mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="engineer@precision.tech"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-label font-medium text-on-surface mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-9 pr-10 py-2.5 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span className="text-xs font-label text-on-surface-variant leading-relaxed">
                I agree to the Terms of Service and Privacy Policy governing the use of this engineering platform
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="primary-gradient-btn w-full flex items-center justify-center gap-2 px-4 py-3 text-on-primary font-label font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Initializing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  INITIALIZE ACCOUNT
                </span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-xs font-label text-on-surface-variant">
                <span className="bg-background px-2">or continue with</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors">
                <Github className="w-5 h-5" />
                GitHub
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-label text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-fixed-dim font-medium">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>

      <div className="w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1233] to-[#070918]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234286f4\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '80px 80px'
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: 'linear-gradient(0deg, rgba(0,76,237,0.2) 0%, transparent 100%)'
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="space-y-10 max-w-lg">
            <div>
              <h2 className="text-4xl font-headline font-semibold text-white leading-tight">
                ENGINEERED FOR<br />
                <span className="text-blue-400">0.01MM TOLERANCE</span>
              </h2>
              <p className="text-blue-200/70 font-body text-sm mt-4 leading-relaxed">
                Precision manufacturing meets cutting-edge thermal engineering. Every component validated to military-grade specifications.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel rounded-lg p-4 border border-white/5 text-center">
                <div className="text-2xl font-headline font-bold text-green-400">99.9%</div>
                <div className="text-xs font-label text-blue-200/60 mt-1">Uptime</div>
              </div>
              <div className="glass-panel rounded-lg p-4 border border-white/5 text-center">
                <div className="text-2xl font-headline font-bold text-green-400">0.12ms</div>
                <div className="text-xs font-label text-blue-200/60 mt-1">Latency</div>
              </div>
              <div className="glass-panel rounded-lg p-4 border border-white/5 text-center">
                <div className="text-2xl font-headline font-bold text-green-400">+40%</div>
                <div className="text-xs font-label text-blue-200/60 mt-1">Thermal</div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 border border-white/5">
              <p className="text-blue-100/80 font-body text-sm leading-relaxed italic">
                "The precision tolerances on these components are unlike anything we've tested. Our thermal imaging confirms a 40% improvement in heat dissipation over industry standard."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  DR
                </div>
                <div>
                  <div className="text-sm font-label text-white">Dr. Elena Rivas</div>
                  <div className="text-xs font-label text-blue-200/50">Lead Engineer, CERN LHC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

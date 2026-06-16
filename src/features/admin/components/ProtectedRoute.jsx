import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading') // loading | admin | denied | redirect
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token
      if (!token) {
        if (!cancelled) setStatus('redirect')
        return
      }
      try {
        const res = await fetch('/admin/check', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Check failed')
        const result = await res.json()
        if (!cancelled) setStatus(result.admin ? 'admin' : 'denied')
      } catch {
        if (!cancelled) setStatus('denied')
      }
    }
    check()
    return () => { cancelled = true }
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-on-surface-variant font-label">Verifying access...</span>
      </div>
    )
  }

  if (status === 'redirect') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-surface-container-low text-on-surface font-body antialiased flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold font-headline mb-4">Access Denied</h1>
          <p className="text-on-surface-variant font-label mb-6">You do not have admin privileges.</p>
          <a href="/" className="text-primary hover:underline font-label">Return to Store</a>
        </div>
      </div>
    )
  }

  return children
}

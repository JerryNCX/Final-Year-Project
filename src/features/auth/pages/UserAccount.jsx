import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Package,
  Grid,
  Settings,
  Shield,
  LogOut,
  Clock,
  Cpu,
  Monitor,
  MemoryStick,
  Thermometer,
  ChevronRight,
  Star,
  User,
  ShieldAlert,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Calendar,
} from 'lucide-react'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'
import { listOrders } from '@/features/cart/api/order'
import { listBuilds } from '@/features/builder/api/builder'
import { getUserProfile } from '@/features/auth/api/user'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const milestones = ['Sourcing', 'Assembly', 'Testing', 'Burn-In', 'Dispatch']

export default function UserAccount() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [builds, setBuilds] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [ordersRes, buildsRes, profileRes] = await Promise.all([
          listOrders().catch(() => ({ data: [] })),
          listBuilds().catch(() => ({ data: [] })),
          getUserProfile().catch(() => null),
        ])
        if (cancelled) return
        setOrders(ordersRes?.data || [])
        setBuilds(buildsRes?.data || [])
        setProfile(profileRes || {})
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load account data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { key: 'orders', label: 'Order History', icon: Clock },
    { key: 'builds', label: 'My Builds', icon: Grid },
    { key: 'settings', label: 'Account Settings', icon: Settings },
    { key: 'security', label: 'Security', icon: Shield },
  ]

  const componentBuild = builds?.[0]?.components || {}
  const componentKeys = Object.keys(componentBuild)
  const activeConfigItems = [
    { icon: Cpu, label: 'Architecture', value: componentBuild['CPU']?.name || 'x86-64 (Zen 5)' },
    { icon: Monitor, label: 'Graphics', value: componentBuild['GPU']?.name || 'NVIDIA Ada Lovelace' },
    { icon: MemoryStick, label: 'Memory', value: componentBuild['Memory']?.name || '32GB DDR5-6000' },
    { icon: Thermometer, label: 'Cooling', value: componentBuild['CPU Cooler']?.name || '360mm AIO Liquid' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="text-lg font-headline font-semibold text-on-background">ORDER LOG</h2>
              {orders.length > 0 && (
                <span className="text-xs font-label text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-label text-sm">No orders yet</p>
                <button
                  onClick={() => navigate('/catalog')}
                  className="mt-3 text-xs font-label text-primary hover:text-primary-fixed-dim"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {orders.map((order) => {
                  const snapshot = order.build_snapshot || {}
                  const items = snapshot.cartItems || []
                  const itemNames = items.slice(0, 2).map(i => i.name).join(', ')
                  const extraCount = items.length - 2
                  return (
                    <div
                      key={order.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                          <Package className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <div>
                          <div className="text-sm font-label font-medium text-on-surface">
                            #{order.id?.slice(0, 8) || 'N/A'}
                          </div>
                          <div className="text-xs font-label text-on-surface-variant mt-0.5">
                            {itemNames || `${items.length} item${items.length !== 1 ? 's' : ''}`}
                            {extraCount > 0 && ` +${extraCount} more`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="text-sm font-label text-on-surface">RM{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="flex items-center gap-1.5 text-xs font-label text-on-surface-variant mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                        <span className={`text-xs font-label px-2 py-1 rounded ${
                          order.status === 'delivered'
                            ? 'text-green-600 bg-green-500/10'
                            : order.status === 'shipped'
                            ? 'text-blue-600 bg-blue-500/10'
                            : 'text-amber-600 bg-amber-500/10'
                        }`}>
                          {(order.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 'builds':
        return (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <h2 className="text-lg font-headline font-semibold text-on-background">MY BUILDS</h2>
              <button
                onClick={() => navigate('/build')}
                className="text-xs font-label text-primary hover:text-primary-fixed-dim font-medium"
              >
                + New Build
              </button>
            </div>
            {builds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                <Grid className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-label text-sm">No saved builds</p>
                <button
                  onClick={() => navigate('/build')}
                  className="mt-3 text-xs font-label text-primary hover:text-primary-fixed-dim"
                >
                  Create a Build
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {builds.map((b) => {
                  const comps = b.components || {}
                  const compCount = Object.keys(comps).length
                  const compSummary = Object.entries(comps)
                    .filter(([, v]) => v && v.name)
                    .slice(0, 2)
                    .map(([, v]) => v.name)
                    .join(' · ')
                  return (
                    <div
                      key={b.id}
                      onClick={() => navigate('/build')}
                      className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 hover:border-primary/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-label font-medium text-on-surface text-sm">{b.name || 'Untitled'}</h3>
                          <p className="text-xs font-label text-on-surface-variant mt-0.5">
                            {compCount} component{compCount !== 1 ? 's' : ''} · {formatDate(b.updated_at || b.created_at)}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      {compSummary && (
                        <div className="text-xs font-label text-on-surface-variant truncate">{compSummary}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 'settings':
        return (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="px-6 py-4 border-b border-outline-variant/20">
              <h2 className="text-lg font-headline font-semibold text-on-background">ACCOUNT SETTINGS</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <span className="text-xs font-label text-on-surface-variant block mb-1">Email</span>
                  <p className="font-label text-sm text-on-surface">{user?.email || profile?.email || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-label text-on-surface-variant block mb-1">Name</span>
                  <p className="font-label text-sm text-on-surface">
                    {profile?.first_name || user?.user_metadata?.first_name || '—'}{' '}
                    {profile?.last_name || user?.user_metadata?.last_name || ''}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-label text-on-surface-variant block mb-1">Phone</span>
                  <p className="font-label text-sm text-on-surface">{profile?.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-label text-on-surface-variant block mb-1">Shipping Address</span>
                  <p className="font-label text-sm text-on-surface">
                    {profile?.address_line1 ? (
                      <>
                        {profile.address_line1}
                        {profile.address_line2 && <>, {profile.address_line2}</>}
                        <br />
                        {profile.city}, {profile.state} {profile.zip}
                      </>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="text-xs font-label text-on-surface-variant">
                  Member since {profile?.created_at ? formatDate(profile.created_at) : '—'}
                </p>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="px-6 py-4 border-b border-outline-variant/20">
              <h2 className="text-lg font-headline font-semibold text-on-background">SECURITY</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-surface-container-lowest rounded-lg p-5 border border-outline-variant/20">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldAlert className="w-5 h-5 text-secondary" />
                  <span className="font-label font-medium text-on-surface text-sm">Two-Factor Authentication</span>
                </div>
                <p className="text-xs font-label text-on-surface-variant leading-relaxed mb-4">
                  2FA is not enabled. Enhance your account security by enabling two-factor authentication.
                </p>
                <button className="text-xs font-label text-primary hover:text-primary-fixed-dim font-medium">
                  Enable 2FA
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-5 border border-outline-variant/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-label font-medium text-on-surface text-sm">Session</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs font-label text-green-600">Active</span>
                </div>
                <p className="text-xs font-label text-on-surface-variant">
                  Signed in as <span className="text-on-surface">{user?.email || '—'}</span>
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-semibold text-on-background">COMMAND CENTER</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-label text-on-surface-variant">
              {user?.email || 'Account'}
            </span>
            <span className="text-on-surface-variant/30">/</span>
            <span className="flex items-center gap-1.5 text-sm font-label text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Session Active
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-error-container/30 text-on-error-container px-4 py-3 rounded-lg text-sm font-label">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex gap-6">
          <aside className="w-64 shrink-0 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-label font-medium text-on-surface">
                    {profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs font-label text-on-surface-variant">
                    ID: {user?.id?.slice(0, 8) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-label transition-colors ${
                    activeTab === item.key
                      ? 'bg-primary-container/20 text-primary font-medium'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {activeTab === item.key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-label text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>

            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-secondary" />
                <span className="text-xs font-label font-medium text-on-surface">Security Notice</span>
              </div>
              <p className="text-xs font-label text-on-surface-variant leading-relaxed">
                2FA is not enabled. Enhance your account security by enabling two-factor authentication.
              </p>
            </div>

            {builds.length > 0 && (
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-tertiary" />
                  <span className="text-xs font-label font-medium text-on-surface">Saved Build</span>
                </div>
                <div
                  onClick={() => navigate('/build')}
                  className="rounded-lg bg-surface-container-high p-3 cursor-pointer hover:bg-surface-container-high/80 transition-colors"
                >
                  <div className="text-sm font-label text-on-surface truncate">{builds[0].name || 'Untitled'}</div>
                  <div className="text-xs font-label text-on-surface-variant mt-0.5 truncate">
                    {Object.values(builds[0].components || {})
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(c => c.name)
                      .join(' · ') || 'No components'}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-label text-primary">
                    <span>View Build</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
          </aside>

          <main className="flex-1 space-y-6">
            {activeTab === 'orders' && componentKeys.length > 0 && (
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-headline font-semibold text-on-background">Active Configuration</h2>
                    <p className="text-sm font-label text-on-surface-variant">
                      {builds[0]?.name || 'LATEST BUILD'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-label font-medium rounded-full">
                    Saved
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm font-label text-on-surface-variant mb-2">
                    <span>Components</span>
                    <span>{componentKeys.length} selected</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                      style={{ width: `${Math.min(100, (componentKeys.length / 8) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {milestones.slice(0, componentKeys.length + 1).map((milestone, i) => (
                    <React.Fragment key={milestone}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-label font-bold ${
                            i < componentKeys.length
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant/50'
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={`text-xs font-label ${
                            i < componentKeys.length ? 'text-on-surface' : 'text-on-surface-variant/50'
                          }`}
                        >
                          {milestone}
                        </span>
                      </div>
                      {i < milestones.length - 1 && i < componentKeys.length && (
                        <div className={`flex-1 h-px ${i < componentKeys.length - 1 ? 'bg-primary' : 'bg-outline-variant'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-4 gap-4">
                {activeConfigItems.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20"
                  >
                    <spec.icon className="w-5 h-5 text-primary mb-2" />
                    <div className="text-xs font-label text-on-surface-variant">{spec.label}</div>
                    <div className="text-sm font-label font-medium text-on-surface mt-0.5">{spec.value}</div>
                  </div>
                ))}
              </div>
            )}

            {renderTabContent()}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

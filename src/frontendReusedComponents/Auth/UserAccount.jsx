import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
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
  ShieldAlert
} from 'lucide-react'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'

const milestones = ['Sourcing', 'Assembly', 'Testing', 'Burn-In', 'Dispatch']

const orderHistory = [
  { id: '#ORD-2023-0042', date: 'Nov 12, 2023', items: 'RTX 4090, Ryzen 9 7950X', total: '$3,847.00', status: 'Delivered' },
  { id: '#ORD-2023-0031', date: 'Aug 04, 2023', items: 'DDR5-6000 64GB, NZXT Kraken', total: '$529.00', status: 'Delivered' },
  { id: '#ORD-2022-0012', date: 'Jan 22, 2022', items: 'ASUS ROG Swift PG32UQ', total: '$1,099.00', status: 'Delivered' }
]

const navItems = [
  { label: 'Order History', icon: Clock, active: true },
  { label: 'My Builds', icon: Grid, active: false },
  { label: 'Account Settings', icon: Settings, active: false },
  { label: 'Security', icon: Shield, active: false }
]

export default function UserAccount() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-semibold text-on-background">
            COMMAND CENTER
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-label text-on-surface-variant">Authentication Level 1</span>
            <span className="text-on-surface-variant/30">/</span>
            <span className="flex items-center gap-1.5 text-sm font-label text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Session Active
            </span>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="w-64 shrink-0 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-label font-medium text-on-surface">
                    {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
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
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-label transition-colors ${
                    item.active
                      ? 'bg-primary-container/20 text-primary font-medium'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
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
              <button className="mt-3 text-xs font-label text-primary hover:text-primary-fixed-dim font-medium">
                Enable 2FA
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-tertiary" />
                <span className="text-xs font-label font-medium text-on-surface">Saved Build</span>
              </div>
              <div className="rounded-lg bg-surface-container-high p-3">
                <div className="text-sm font-label text-on-surface">Project: Nebula</div>
                <div className="text-xs font-label text-on-surface-variant mt-0.5">RTX 5090 · Ryzen 9</div>
                <div className="mt-2 flex items-center gap-1 text-xs font-label text-primary">
                  <span>View Build</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-headline font-semibold text-on-background">
                    Active Configuration
                  </h2>
                  <p className="text-sm font-label text-on-surface-variant">PROJECT: OBSIDIAN</p>
                </div>
                <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-label font-medium rounded-full">
                  In Progress
                </span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm font-label text-on-surface-variant mb-2">
                  <span>Build Progress</span>
                  <span>60%</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {milestones.map((milestone, i) => (
                  <React.Fragment key={milestone}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-label font-bold ${
                          i < 3
                            ? 'bg-primary text-on-primary'
                            : i === 3
                            ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
                            : 'bg-surface-container-high text-on-surface-variant/50'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`text-xs font-label ${
                          i < 3 ? 'text-on-surface' : 'text-on-surface-variant/50'
                        }`}
                      >
                        {milestone}
                      </span>
                    </div>
                    {i < milestones.length - 1 && (
                      <div
                        className={`flex-1 h-px ${
                          i < 2 ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Cpu, label: 'Architecture', value: 'x86-64 (Zen 5)' },
                { icon: Monitor, label: 'Graphics', value: 'NVIDIA Ada Lovelace' },
                { icon: MemoryStick, label: 'Memory', value: '32GB DDR5-6000' },
                { icon: Thermometer, label: 'Cooling', value: '360mm AIO Liquid' }
              ].map((spec) => (
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

            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="px-6 py-4 border-b border-outline-variant/20">
                <h2 className="text-lg font-headline font-semibold text-on-background">ORDER LOG</h2>
              </div>
              <div className="divide-y divide-outline-variant/20">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                        <Package className="w-5 h-5 text-on-surface-variant" />
                      </div>
                      <div>
                        <div className="text-sm font-label font-medium text-on-surface">{order.id}</div>
                        <div className="text-xs font-label text-on-surface-variant mt-0.5">{order.items}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-label text-on-surface">{order.total}</div>
                      <div className="flex items-center gap-1.5 text-xs font-label text-on-surface-variant mt-0.5">
                        <Clock className="w-3 h-3" />
                        {order.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

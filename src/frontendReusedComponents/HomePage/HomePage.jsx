import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ArrowRight, Cpu, Zap, Thermometer, HardDrive } from 'lucide-react'

const categories = [
  { number: '01', label: 'LOGIC', title: 'PROCESSORS', icon: Cpu, path: 'CPU' },
  { number: '02', label: 'RENDER', title: 'GRAPHICS', icon: Zap, path: 'GPU' },
  { number: '03', label: 'NEXUS', title: 'BOARDS', icon: HardDrive, path: 'Motherboard' },
  { number: '04', label: 'STREAM', title: 'STORAGE', icon: Thermometer, path: 'Internal Drive' },
]

const featuredProducts = [
  {
    badge: 'PERFORMANCE THERMAL',
    name: 'VERTEX RTX 9090 PRO',
    desc: 'Ultra-Efficient Ada Lovelace Architecture',
    specs: { VRAM: '48GB GDDR7', Bandwidth: '1.2 TB/s', Cores: '18432 CUDA', TGP: '450W' },
    price: 'RM8,795.60',
  },
  {
    name: 'APEX Z890 EXTREME',
    desc: 'Next-Gen Socket LGA 1851 Support',
    specs: { Slots: '4x PCIE 5.0', Ethernet: '10GbE LAN', RAM: '256GB DDR5', Phases: '24+2+1' },
    price: 'RM2,855.60',
  },
  {
    badge: 'NEW RELEASE',
    name: 'QUBIT X-12 CORE',
    desc: 'Multi-Threaded Mastery for Workstations',
    specs: { Cores: '24P + 12E', Boost: '6.2 GHz', Cache: '60MB L3', TDP: '125W' },
    price: 'RM2,591.60',
  },
]

const diagnosticLines = [
  { label: 'SYSTEM INIT', status: 'OK', delay: '0.2s' },
  { label: 'CPU DETECTION', status: 'PASS', delay: '1.0s' },
  { label: 'MEMORY CHECK', status: '32GB DDR5-6400', delay: '1.8s' },
  { label: 'GPU INIT', status: 'DETECTED', delay: '2.6s' },
  { label: 'STORAGE SCAN', status: 'NVMe 2TB', delay: '3.4s' },
  { label: 'THERMAL CALIB', status: 'NOMINAL', delay: '4.2s' },
]

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface font-body">
      <Header />

      <main>
        {/* Hero Section — BIOS Diagnostic */}
        <section className="relative min-h-[800px] flex items-center overflow-hidden">
          <div className="absolute inset-0 noise-overlay animate-noise-shift" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-dim via-background to-surface-dim" />

          <div className="container mx-auto px-6 md:px-10 grid grid-cols-12 gap-8 items-center relative z-10">
            <div className="col-span-12 lg:col-span-7">
              <div className="diagnostic-panel p-6 md:p-8 mb-8 max-w-2xl">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-primary/15">
                  <span className="w-2 h-2 bg-primary animate-pulse-amber" />
                  <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase">PRECISION TECH BIOS v1.0</span>
                  <span className="font-label text-[10px] text-on-surface-variant/50 ml-auto">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {diagnosticLines.map((line, i) => (
                    <div
                      key={line.label}
                      className="animate-diag-fade-in flex items-center gap-3 font-label text-xs"
                      style={{ animationDelay: line.delay, opacity: 0 }}
                    >
                      <span className="text-primary text-[10px] w-4">{'>'}</span>
                      <span className="text-on-surface-variant w-28 md:w-36 uppercase tracking-wider">{line.label}</span>
                      <span className="flex-1 h-px bg-outline/20 mx-2" />
                      <span className="text-primary font-semibold">{line.status}</span>
                      {i < diagnosticLines.length - 1 && (
                        <span className="text-[10px] text-on-surface-variant/30 font-label">{'[OK]'}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-primary/15">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider">System Boot</span>
                    <span className="font-label text-[10px] text-primary">{'[________________________]'}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container overflow-hidden">
                    <div className="h-full w-1/3 bg-primary animate-boot-indeterminate" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <span className="inline-block font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-2">
                  {'>'} SYSTEM READY // EXTREME PERFORMANCE SERIES
                </span>
                <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl tracking-tight text-on-surface leading-[0.85]">
                  FORGED IN <span className="text-primary amber-glow-text">SILICON.</span><br/>DEFINED BY SPEED.
                </h1>
                <p className="font-body text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed uppercase tracking-wider">
                  Engineering the next generation of high-performance computing. Experience ultra-low latency and thermal excellence with Precision Tech components.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-3 bg-primary text-on-primary font-headline text-lg tracking-wide px-10 py-4 hover:bg-primary-container transition-colors duration-300"
                  >
                    EXPLORE SERIES
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/build"
                    className="font-label text-xs tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                  >
                    CONFIGURE BUILD
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex col-span-5 justify-center">
              <div className="diagnostic-panel p-6 w-full max-w-sm">
                <div className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-4 pb-3 border-b border-primary/15">
                  {'>'} SYSTEM MONITOR
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'CPU', value: '32%', bar: '32%' },
                    { label: 'GPU', value: '18%', bar: '18%' },
                    { label: 'MEM', value: '45%', bar: '45%' },
                    { label: 'TEMP', value: '42°C', bar: '28%' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label text-[10px] tracking-wider text-on-surface-variant">{stat.label}</span>
                        <span className="font-label text-[10px] text-primary">{stat.value}</span>
                      </div>
                      <div className="h-1 bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: stat.bar }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 md:py-28 bg-surface-container-low">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between mb-12 md:mb-16">
              <div>
                <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-2 block">{'>'} INVENTORY</span>
                <h2 className="font-headline text-4xl md:text-5xl tracking-tight text-on-surface uppercase">Core Components</h2>
              </div>
              <Link
                to="/catalog"
                className="hidden md:inline-flex font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant hover:text-primary transition-colors items-center gap-2"
              >
                VIEW ALL <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.title}
                    to={`/catalog?category=${encodeURIComponent(cat.path)}`}
                    className="group relative bg-surface-container-lowest p-6 md:p-8 trace-border transition-all duration-300"
                  >
                    <div className="mb-6">
                      <span className="font-label text-[10px] text-primary tracking-widest">{cat.number}</span>
                    </div>
                    <Icon className="w-8 h-8 text-outline group-hover:text-primary transition-colors duration-300 mb-4" />
                    <div className="font-label text-[10px] text-on-surface-variant tracking-[0.15em] uppercase mb-1">{cat.label}</div>
                    <h3 className="font-headline text-2xl md:text-3xl tracking-tight text-on-surface group-hover:text-primary transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <div className="mt-6 flex items-center gap-2 font-label text-[10px] tracking-widest uppercase text-on-surface-variant/50 group-hover:text-primary transition-colors">
                      <span>BROWSE</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-center gap-6 mb-12 md:mb-20">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} FEATURED</span>
              <h2 className="font-headline text-3xl md:text-5xl tracking-tight text-on-surface uppercase">Performance Tier</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product, i) => (
                <div key={i} className="group trace-border bg-surface-container-lowest transition-all duration-300 hover:bg-surface-container">
                  <div className="p-6 md:p-8">
                    {product.badge && (
                      <span className="inline-block font-label text-[10px] tracking-[0.15em] bg-primary/10 text-primary px-3 py-1 mb-4 uppercase">
                        {product.badge}
                      </span>
                    )}
                    <h4 className="font-headline text-2xl md:text-3xl tracking-tight text-on-surface mb-1">{product.name}</h4>
                    <p className="font-label text-[11px] text-on-surface-variant uppercase tracking-wider mb-6">{product.desc}</p>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key}>
                          <div className="font-label text-[11px] text-on-surface-variant/60 tracking-[0.15em] uppercase mb-0.5">{key}</div>
                          <div className="font-body text-xs text-on-surface">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-6 md:px-8 pb-6 md:pb-8">
                    <span className="font-headline text-2xl tracking-tight text-primary">{product.price}</span>
                    <Link
                      to="/build"
                      className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      CONFIGURE <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / Terminal Signup */}
        <section className="py-20 md:py-28 bg-surface-container-low">
          <div className="container mx-auto px-6 md:px-10">
            <div className="diagnostic-panel max-w-3xl mx-auto p-6 md:p-10">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-2 block">{'>'} SUBSCRIBE // SIGNAL</span>
              <h2 className="font-headline text-3xl md:text-5xl tracking-tight text-on-surface uppercase mb-4">
                STAY AT THE EDGE
              </h2>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-8 max-w-xl">
                Technical briefings, component drops, and overclocking guides delivered to your terminal.
              </p>
              <form className="flex flex-col md:flex-row gap-4 max-w-xl" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-label text-sm select-none">{'>'}</span>
                  <input
                    className="w-full bg-surface-container border border-outline/30 text-on-surface font-body text-sm px-8 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/40 uppercase tracking-wider"
                    placeholder="ENTER EMAIL..."
                    type="email"
                  />
                </div>
                <button className="bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-10 py-3 hover:bg-primary-container transition-colors whitespace-nowrap">
                  SUBSCRIBE
                </button>
              </form>
              <div className="mt-4 font-label text-[11px] text-on-surface-variant/40 uppercase tracking-widest">
                By subscribing, you agree to our Protocol and Privacy Policy.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

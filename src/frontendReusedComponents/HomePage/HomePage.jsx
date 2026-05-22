import React from 'react'
import Header from './Header'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  { number: '01', label: 'Logic', title: 'PROCESSORS', description: 'CPU', image: '' },
  { number: '02', label: 'Render', title: 'GRAPHICS', description: 'GPU', image: '' },
  { number: '03', label: 'Nexus', title: 'BOARDS', description: 'Motherboard', image: '' },
  { number: '04', label: 'Stream', title: 'STORAGE', description: 'SSD', image: '' },
]

const featuredProducts = [
  {
    badge: 'Performance Thermal',
    name: 'VERTEX RTX 9090 PRO',
    desc: 'Ultra-Efficient Ada Lovelace Architecture',
    specs: { VRAM: '48GB GDDR7', Power: '450W TGP' },
    price: '$1,999.00',
  },
  {
    name: 'APEX Z890 EXTREME',
    desc: 'Next-Gen Socket LGA 1851 Support',
    specs: { Slots: '4x PCIE 5.0', Ethernet: '10GbE LAN' },
    price: '$649.00',
  },
  {
    badge: 'New Release',
    name: 'QUBIT X-12 CORE',
    desc: 'Multi-Threaded Mastery for Workstations',
    specs: { Cores: '24P + 12E', Boost: '6.2 GHz' },
    price: '$589.00',
  },
]

export default function HomePage() {
  return (
    <div className="bg-background text-on-surface font-body">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#dde1ff_0%,#f9f9fe_70%)] opacity-40"></div>
          <div className="container mx-auto px-8 grid grid-cols-12 gap-8 items-center relative z-10">
            <div className="col-span-12 lg:col-span-6">
              <div className="inline-block bg-secondary-fixed text-on-secondary-fixed text-[10px] tracking-[0.2em] font-bold py-1 px-3 mb-6 uppercase">
                Extreme Performance Series
              </div>
              <h1 className="font-headline text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-on-surface mb-8">
                FORGED IN <span className="text-primary">SILICON.</span><br/>DEFINED BY SPEED.
              </h1>
              <p className="text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed">
                Engineering the next generation of high-performance computing. Experience ultra-low latency and thermal excellence with the new Precision ATELIER components.
              </p>
              <div className="flex items-center space-x-6">
                <a href="/catalog" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-lg font-bold tracking-tight shadow-xl hover:shadow-primary/20 transition-all">
                  EXPLORE THE SERIES
                </a>
                <a href="/about" className="flex items-center space-x-2 text-on-surface font-semibold group">
                  <span>Watch Technical Reveal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 relative">
              <div className="relative scale-110 translate-x-12">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-surface-container-highest rounded-xl flex items-center justify-center">
                  <div className="text-8xl font-headline font-bold text-primary/20">GPU</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="font-headline text-4xl font-bold tracking-tight mb-2 uppercase">Core Inventories</h2>
                <div className="h-1 w-20 bg-primary"></div>
              </div>
              <a href="/catalog" className="text-on-surface-variant font-label text-sm tracking-widest uppercase hover:text-primary transition-colors">Select Hierarchy</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['CPU', 'GPU', 'Motherboard', 'SSD'].map((cat, i) => (
                <a
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="group relative aspect-[4/5] bg-surface-container-lowest overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl font-headline font-bold">{cat[0]}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="text-[10px] font-bold tracking-widest text-primary mb-2 block uppercase">
                      {['01 / Logic', '02 / Render', '03 / Nexus', '04 / Stream'][i]}
                    </span>
                    <h3 className="font-headline text-3xl font-bold">{cat.toUpperCase()}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-32">
          <div className="container mx-auto px-8">
            <div className="flex items-center space-x-4 mb-20">
              <h2 className="font-headline text-5xl font-bold tracking-tighter uppercase">Featured Tier</h2>
              <div className="flex-grow h-px bg-outline-variant/30"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredProducts.map((product, i) => (
                <div key={i} className="group">
                  <div className="bg-surface-container-lowest p-8 transition-all group-hover:bg-surface-bright mb-6 relative overflow-hidden">
                    {product.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-secondary text-on-secondary px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <div className="w-full h-64 flex items-center justify-center mb-8">
                      <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center">
                        <span className="text-4xl font-headline font-bold text-primary/30">{i === 0 ? 'GPU' : i === 1 ? 'MB' : 'CPU'}</span>
                      </div>
                    </div>
                    <h4 className="font-headline text-2xl font-bold mb-2">{product.name}</h4>
                    <p className="text-on-surface-variant text-sm mb-6">{product.desc}</p>
                    <div className="grid grid-cols-2 gap-y-4 border-t border-outline-variant/15 pt-6">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key}>
                          <div className="text-[10px] text-outline tracking-widest font-bold uppercase mb-1">{key}</div>
                          <div className="font-headline font-semibold">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="font-headline text-2xl font-bold">{product.price}</span>
                    <a href="/catalog" className="text-primary font-bold text-sm tracking-widest uppercase border-b-2 border-primary/0 hover:border-primary transition-all">
                      Configure Build
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 relative overflow-hidden bg-slate-900 text-slate-100">
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-4xl">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Engineered Intelligence</span>
              <h2 className="font-headline text-5xl font-bold tracking-tighter mb-8 leading-tight">
                STAY AT THE EDGE OF <br/>COMPUTATIONAL LIMITS.
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl">
                Subscribe to our Technical Briefings. Get early access to component drops, overclocking guides, and professional workstation builds.
              </p>
              <form className="flex flex-col md:flex-row gap-4 max-w-xl">
                <input
                  className="flex-grow bg-slate-800/50 border-b-2 border-slate-700 focus:border-primary text-slate-100 px-0 py-4 font-headline tracking-widest transition-all"
                  placeholder="ENTER WORKSTATION EMAIL"
                  type="email"
                />
                <button className="bg-primary text-on-primary px-12 py-4 font-bold tracking-widest uppercase hover:bg-primary-container transition-all whitespace-nowrap">
                  SUBSCRIBE
                </button>
              </form>
              <div className="mt-4 text-[10px] text-slate-500 tracking-widest uppercase">
                By subscribing, you agree to our Protocol and Privacy Policy.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-100 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12 max-w-[1920px] mx-auto">
          <div>
            <div className="font-headline font-bold text-lg mb-6 uppercase tracking-tight">TECH ATELIER</div>
            <p className="text-slate-500 text-sm uppercase tracking-widest max-w-md">
              &copy; 2024 TECH ATELIER. ENGINEERED FOR PERFORMANCE.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="font-bold text-xs tracking-widest uppercase mb-4 text-slate-900">Information</div>
              <ul className="space-y-3">
                <li><a href="/about" className="text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="/contact" className="text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-bold text-xs tracking-widest uppercase mb-4 text-slate-900">Account</div>
              <ul className="space-y-3">
                <li><a href="/login" className="text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Sign In</a></li>
                <li><a href="/cart" className="text-sm uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Cart</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

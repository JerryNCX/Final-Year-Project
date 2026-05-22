import React from 'react'
import { Trash2, ShoppingCart, Heart } from 'lucide-react'

const wishlistItems = [
  {
    sku: 'SKU: VP-CPU-9950X',
    name: 'Quantum Core i9-14900K',
    desc: '24 Cores / 32 Threads, up to 6.0 GHz. Unlocked desktop processor.',
    specs: [
      { label: 'Architecture', value: 'Raptor Lake' },
      { label: 'TDP', value: '125W Base' },
    ],
    price: '$589.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZmS-I9OfQDPngFU21DqwErMgANRFw62qcS-x8acbikt7VRT34q4JDzU8xl5nfmZ6ePHzd4E3HRRBORYYRz2O0O4gJkvCM0qAZXuQIW0ZpLyss7u95m5R_Al7pg9iK5sSJEjCEW5Xef5eqOpYXxOyIt-MG6kZ2cEF-J_wwwT6tc5sQ-aexue837sPIz9GuYueugkxs-b_fvw5F5SHU5lODnmpS6KU-1SLyQvJ15qG8ht9m31ZZvva_Y7yGAJT947qLwU4dgJFWDH6O',
  },
  {
    sku: 'SKU: VP-GPU-4090',
    name: 'Vortex RTX 4090 Extreme',
    desc: '24GB GDDR6X, Triple Fan Thermal Design, Ultimate Ray Tracing.',
    specs: [
      { label: 'VRAM', value: '24GB GDDR6X' },
      { label: 'Status', value: 'Low Stock' },
    ],
    price: '$1,599.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS8-aW4XFHhb6_oP3lR5DoWUgfh_tFAcrUev_aU3sl7mgDSGwRkH-jn5sqwp2rJiLnLJpF63KQ3QCb3_OO8gijIBKurZ3xD1B1dY57FDHsh_zIWQpLs-T_6LPhypPerfdMovVqYRmtbbO5_ju_ejh70YbPvCt7CMDcvrAkiMwYlNHqo-hO9YC1c64WppmXW7kRED76shGeGkdVvDmU-u3-v_4TOgC0ddS_V4yDWUHcOBcdyYr7e3YgCJtVg2YiHXTzzT6_46YteZ_u',
  },
  {
    sku: 'SKU: VP-MB-Z790',
    name: 'Aero Z790 Master',
    desc: 'E-ATX Motherboard, DDR5 Support, PCIe 5.0, 10GbE LAN.',
    specs: [
      { label: 'Form Factor', value: 'E-ATX' },
      { label: 'Socket', value: 'LGA 1700' },
    ],
    price: '$499.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLm1MVlZC7xXsBK0pfUE0QumA5WyYbxOCoV0nAkhIkDMWsRw330RltmG9dJsGKdQZpjCIcmYnYVvbsYOX7dTT3naPiiqTliweTAZDyexgBRsQWccnEmBktdcDVmXYyTwG8YfRiNIac1CVqbh59JrmVVDbwOHwgYFa1vTQdArJ8nSfTwMe7Z1Yebq4r8QC4gLtE7pYKekmYwZ2xMI6JKvx-6D-zpZ1kYxXTXadOrgaYCab8WwaAkWveCe8x7lcx35T_6Jh0W2a_i-qh',
  },
  {
    sku: 'SKU: VP-PSU-1200',
    name: 'Titanium PSU 1200W',
    desc: 'Fully modular, 80+ Titanium rated, zero-RPM fan mode.',
    specs: [
      { label: 'Efficiency', value: '80+ Titanium' },
      { label: 'Wattage', value: '1200W' },
    ],
    price: '$349.00',
    image: '',
  },
]

export default function Wishlist() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <header className="bg-slate-50/80 backdrop-blur-xl sticky top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-10 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-12">
            <a className="text-xl font-black italic tracking-tighter text-slate-900 font-display" href="/">VOLTAGE PRECISION</a>
            <nav className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
              <a className="text-slate-600 font-medium hover:text-blue-600 transition-all duration-300" href="/catalog">Catalog</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 transition-all duration-300" href="/builds">Builds</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 transition-all duration-300" href="/support">Support</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 transition-all duration-300" href="/about">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-blue-600 hover:text-blue-500 transition-all duration-300">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-blue-600 hover:text-blue-500 transition-all duration-300">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-slate-200/30 h-[1px] w-full"></div>
      </header>

      <main className="flex-grow flex flex-col items-center py-16 px-6 lg:px-10">
        <div className="w-full max-w-[1440px]">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <p className="font-label text-sm uppercase tracking-[0.05em] text-on-surface-variant mb-2">My Account</p>
              <h1 className="text-5xl font-display font-bold tracking-tight text-on-surface">Saved Components</h1>
            </div>
            <div className="text-on-surface-variant text-sm font-label">
              4 Items Total
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {wishlistItems.map((item, i) => (
              <div
                key={i}
                className="group bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-300 hover:bg-surface-bright outline outline-1 outline-outline-variant/15 relative"
              >
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant bg-surface-container px-2 py-1 rounded">{item.sku}</span>
                    <button className="text-on-surface-variant hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="aspect-video mb-6 bg-surface-container-low rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        src={item.image}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant font-display font-bold text-4xl">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-on-surface">{item.name}</h3>
                  <p className="text-on-surface-variant mb-6 text-sm">{item.desc}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {item.specs.map((spec, j) => (
                      <div key={j}>
                        <p className="text-xs text-on-surface-variant mb-1">{spec.label}</p>
                        <p className="font-semibold text-sm text-on-surface">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant/50">
                    <span className="font-display text-xl font-bold text-on-surface">{item.price}</span>
                    <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-100 w-full py-12 px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end max-w-[1920px] mx-auto">
          <div>
            <div className="text-lg font-black text-slate-900 font-display mb-8">VOLTAGE PRECISION</div>
            <div className="bg-slate-300 h-[1px] mb-8"></div>
            <p className="font-body text-xs uppercase tracking-[0.1em] text-slate-500">&copy; 2024 VOLTAGE PRECISION. ENGINEERED FOR MAXIMUM TOLERANCE.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end font-body text-xs uppercase tracking-[0.1em]">
            <a className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors duration-200" href="#">Warranty</a>
            <a className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors duration-200" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors duration-200" href="#">Terms of Service</a>
            <a className="text-slate-500 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors duration-200" href="#">Shipping &amp; Returns</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React from 'react'

export default function Footer() {
  return (
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
  )
}

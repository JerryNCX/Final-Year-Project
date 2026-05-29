import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 max-w-[1920px] mx-auto">
        <div>
          <div className="font-headline font-bold text-lg mb-6 uppercase tracking-tight text-on-surface">PRECISION TECH</div>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">
            &copy; 2024 PRECISION TECH. ENGINEERED FOR PERFORMANCE. EVERY COMPONENT IS HAND-SELECTED FOR MISSION-CRITICAL STABILITY AND PEAK THROUGHPUT.
          </p>
        </div>
        <div className="space-y-4">
          <div className="font-bold text-xs tracking-widest uppercase mb-5 text-on-surface">Information</div>
          <ul className="space-y-3">
            <li><a href="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="/about" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <div className="font-bold text-xs tracking-widest uppercase mb-5 text-on-surface">Support</div>
          <ul className="space-y-3">
            <li><a href="/contact" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Support</a></li>
            <li><a href="/contact" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Returns</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

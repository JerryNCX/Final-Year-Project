import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 bg-surface-dim">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 px-6 md:px-10 max-w-[1920px] mx-auto">
        <div>
          <div className="font-headline text-2xl tracking-wide text-on-surface mb-5">PRECISION TECH</div>
          <p className="text-on-surface-variant font-body text-xs leading-relaxed max-w-md uppercase tracking-wider">
            &copy; 2024 PRECISION TECH. ENGINEERED FOR PERFORMANCE. EVERY COMPONENT HAND-SELECTED FOR MISSION-CRITICAL STABILITY AND PEAK THROUGHPUT.
          </p>
        </div>
        <div className="space-y-4">
          <div className="font-label text-[10px] tracking-[0.2em] uppercase text-primary mb-5">Information</div>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <div className="font-label text-[10px] tracking-[0.2em] uppercase text-primary mb-5">Support</div>
          <ul className="space-y-3">
            <li>
              <Link to="/contact" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/contact" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                Returns
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

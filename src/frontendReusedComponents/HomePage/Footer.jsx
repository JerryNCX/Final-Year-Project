import React from 'react'

export default function Footer() {
  return (
    <footer className="py-8 border-t mt-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tech &amp; Comp</h3>
          <p className="text-sm text-muted-foreground">
            Your one‑stop shop for performance‑focused gear, from workstations to gaming setups.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Shop</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>Laptops</li>
            <li>Desktops</li>
            <li>Accessories</li>
            <li>Gaming</li>
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Support</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>Help Center</li>
            <li>Shipping &amp; Returns</li>
            <li>Warranty</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Follow</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Youtube</li>
            <li>Discord</li>
          </ul>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground text-center md:text-left">
        © {new Date().getFullYear()} Tech &amp; Comp. All rights reserved.
      </p>
    </footer>
  )
}


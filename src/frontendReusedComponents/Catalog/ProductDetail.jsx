import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingBag, Heart, Truck, Star, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Footer from '../HomePage/Footer'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedThumb, setSelectedThumb] = useState(0)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('Product_Catalog')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        setProduct(data)
      } catch (err) {
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Nav />
        <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="bg-surface-container w-full aspect-video animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-3 bg-surface-container w-1/4 animate-pulse" />
              <div className="h-8 bg-surface-container w-3/4 animate-pulse" />
              <div className="h-4 bg-surface-container w-1/3 animate-pulse" />
              <div className="h-6 bg-surface-container w-1/4 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Nav />
        <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-20 text-center">
          <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} ERROR</span>
          <h1 className="font-headline text-4xl tracking-tight text-on-surface uppercase mt-3">Product Not Found</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-2">The requested product does not exist.</p>
          <Link to="/catalog" className="inline-block mt-8 bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary-container transition-colors">
            BACK TO CATALOG
          </Link>
        </main>
      </div>
    )
  }

  const thumbnails = product.Images || [product.Image].filter(Boolean)
  const specsGrid = [
    { label: 'ARCHITECTURE', value: product.Architecture || 'Ada Lovelace' },
    { label: 'VRAM', value: product.VRAM || '24GB GDDR6X' },
    { label: 'BOOST CLOCK', value: product.Boost_Clock || '2640 MHz' },
    { label: 'CUDA CORES', value: product.Cores || '16384' },
  ]

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Nav />

      <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <Link to="/catalog" className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" />
          BACK TO CATALOG
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-32">
          {/* Image gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container w-full aspect-video flex items-center justify-center p-8 md:p-12 relative overflow-hidden trace-border">
              {thumbnails[selectedThumb] ? (
                <img
                  src={thumbnails[selectedThumb]}
                  alt={product.Product_name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <span className="font-headline text-6xl text-outline/20">{product.Product_name?.[0] || '?'}</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.length > 0 ? (
                thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThumb(i)}
                    className={`aspect-square p-3 flex items-center justify-center transition-all ${
                      i === selectedThumb
                        ? 'trace-border-active bg-surface-container'
                        : 'trace-border bg-surface-container-lowest hover:bg-surface-container'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-contain"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </button>
                ))
              ) : (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square trace-border bg-surface-container-lowest" />
                ))
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-1">
              <span className="font-label text-[10px] tracking-[0.15em] text-primary uppercase">
                SKU: {product.SKU || product.ASIN || 'N/A'}
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface leading-[0.9] mb-4 uppercase">
              {product.Product_name || 'PRODUCT NAME'}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-label text-[10px] tracking-[0.15em] bg-primary/10 text-primary px-3 py-1 uppercase">
                EXTREME PERFORMANCE
              </span>
              <div className="flex items-center text-primary gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary" />
                ))}
                <Star className="w-3.5 h-3.5 fill-primary/50" />
                <span className="font-label text-[10px] text-on-surface-variant ml-2 tracking-wider">4.9 (128)</span>
              </div>
            </div>
            <div className="mb-8">
              <span className="font-headline text-3xl md:text-4xl tracking-tight text-primary">
                {product.Current_price ? `$${product.Current_price}` : '—'}
              </span>
            </div>

            {/* Spec gauges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {specsGrid.map((spec) => (
                <div key={spec.label} className="bg-surface-container p-4 trace-border">
                  <div className="font-label text-[8px] text-on-surface-variant/60 tracking-[0.15em] uppercase mb-1">{spec.label}</div>
                  <div className="font-body text-sm text-on-surface">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <button className="bg-primary text-on-primary font-label text-sm tracking-[0.15em] uppercase py-4 px-8 hover:bg-primary-container transition-colors flex items-center justify-center gap-3 w-full">
                <ShoppingBag className="w-4 h-4" />
                ADD TO CART
              </button>
              <button className="bg-surface-container-lowest text-on-surface font-label text-sm tracking-[0.15em] uppercase py-4 px-8 border border-outline/30 hover:bg-surface-container transition-colors flex items-center justify-center gap-3 w-full">
                <Heart className="w-4 h-4" />
                SAVE TO WISHLIST
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-on-surface-variant font-label text-[10px] uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              Free standard shipping on orders over $500.
            </div>
          </div>
        </section>

        {/* Full specs section */}
        <section className="mb-20 md:mb-32">
            <div className="flex items-center gap-6 mb-8 md:mb-12">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} SPECIFICATIONS</span>
              <h2 className="font-headline text-2xl md:text-4xl tracking-tight text-on-surface uppercase">Engineered Specs</h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="trace-border bg-surface-container-lowest p-5 md:p-6">
              <h3 className="font-label text-xs tracking-[0.15em] text-primary uppercase mb-5">GPU Engine Specs</h3>
              <ul className="space-y-3">
                {[
                  { label: 'CUDA CORES', value: product.Cores || '16384' },
                  { label: 'BOOST CLOCK', value: product.Boost_Clock || '2.52 GHz' },
                  { label: 'BASE CLOCK', value: product.Core_Clock || '2.23 GHz' },
                ].map((spec) => (
                  <li key={spec.label} className="flex justify-between items-center">
                    <span className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider">{spec.label}</span>
                    <span className="font-body text-[11px] text-on-surface">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="trace-border bg-surface-container-lowest p-5 md:p-6">
              <h3 className="font-label text-xs tracking-[0.15em] text-primary uppercase mb-5">Memory Specs</h3>
              <ul className="space-y-3">
                {[
                  { label: 'CONFIG', value: product.VRAM || '24 GB GDDR6X' },
                  { label: 'INTERFACE', value: '384-bit' },
                  { label: 'BANDWIDTH', value: '1.2 TB/s' },
                ].map((spec) => (
                  <li key={spec.label} className="flex justify-between items-center">
                    <span className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider">{spec.label}</span>
                    <span className="font-body text-[11px] text-on-surface">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="trace-border bg-surface-container-lowest p-5 md:p-6">
              <h3 className="font-label text-xs tracking-[0.15em] text-primary uppercase mb-5">Display Support</h3>
              <ul className="space-y-3">
                {[
                  { label: 'MAX RESOLUTION', value: '7680x4320' },
                  { label: 'CONNECTORS', value: 'HDMI, 3x DisplayPort' },
                  { label: 'MULTI MONITOR', value: 'Up to 4' },
                ].map((spec) => (
                  <li key={spec.label} className="flex justify-between items-center">
                    <span className="font-label text-[9px] text-on-surface-variant/60 uppercase tracking-wider">{spec.label}</span>
                    <span className="font-body text-[11px] text-on-surface">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <nav className="bg-surface-dim/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-3 max-w-[1920px] mx-auto">
        <Link to="/" className="font-headline text-2xl md:text-3xl tracking-wide text-on-surface hover:text-primary transition-colors">
          PRECISION TECH
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {[
            { to: '/', label: 'Home' },
            { to: '/catalog', label: 'Catalog' },
            { to: '/build', label: 'Build' },
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Support' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-label text-xs uppercase tracking-[0.15em] py-1 transition-colors ${
                link.to === '/catalog' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

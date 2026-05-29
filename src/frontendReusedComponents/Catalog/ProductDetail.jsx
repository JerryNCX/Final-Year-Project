import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User, ShoppingCart, Star, ShoppingBag, Heart, Truck } from 'lucide-react'
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
      <div className="min-h-screen bg-background text-on-surface font-body antialiased">
        <Nav />
        <main className="max-w-[1920px] mx-auto px-4 md:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="bg-surface-container-low w-full aspect-video animate-pulse rounded-sm" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 bg-surface-container-low rounded w-1/4 animate-pulse" />
              <div className="h-12 bg-surface-container-low rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-surface-container-low rounded w-1/3 animate-pulse" />
              <div className="h-8 bg-surface-container-low rounded w-1/4 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-on-surface font-body antialiased">
        <Nav />
        <main className="max-w-[1920px] mx-auto px-4 md:px-10 py-12 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-on-surface-variant mt-2">The requested product does not exist.</p>
        </main>
      </div>
    )
  }

  const thumbnails = product.Images || [product.Image].filter(Boolean)

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-on-primary">
      <Nav />

      <main className="max-w-[1920px] mx-auto px-4 md:px-10 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container-low w-full aspect-video flex items-center justify-center p-12 relative overflow-hidden group">
              {thumbnails[selectedThumb] ? (
                <img
                  src={thumbnails[selectedThumb]}
                  alt={product.Product_name}
                  className="w-full h-full object-contain mix-blend-multiply z-10 transition-transform duration-700 group-hover:scale-105"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-body">No Image</div>
              )}
              <div className="absolute inset-0 bg-primary/5 blur-[100px] z-0 rounded-full w-3/4 h-3/4 m-auto"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.length > 0 ? (
                thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThumb(i)}
                    className={`aspect-square p-4 focus:outline-none relative overflow-hidden ${
                      i === selectedThumb
                        ? 'bg-surface-container-low border border-primary/50'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low transition-colors outline outline-1 outline-outline-variant/15'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </button>
                ))
              ) : (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest aspect-square p-4 outline outline-1 outline-outline-variant/15"></div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-2">
              <span className="font-label text-sm uppercase tracking-[0.05em] text-on-surface-variant font-semibold">
                SKU: {product.SKU || 'VP-RTX-4090-OC'}
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-on-surface leading-tight tracking-tighter mb-4">
              {product.Product_name || 'TITAN RTX 4090 OVERCLOCK ED.'}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-secondary/10 px-3 py-1 rounded-sm border border-secondary/20">
                <span className="font-label text-secondary font-bold text-sm tracking-wide">EXTREME PERFORMANCE</span>
              </div>
              <div className="flex items-center text-primary gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
                <Star className="w-4 h-4 fill-primary/50" />
                <span className="font-label text-sm font-medium text-on-surface-variant ml-2">4.9 (128 Reviews)</span>
              </div>
            </div>
            <div className="mb-10">
              <span className="font-headline text-4xl font-bold text-on-surface">
                {product.Current_price ? `$${product.Current_price}` : '$1,999.00'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-surface-container-low p-5 outline outline-1 outline-outline-variant/15">
                <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">Architecture</div>
                <div className="font-headline font-bold text-on-surface text-lg">{product.Architecture || 'Ada Lovelace'}</div>
              </div>
              <div className="bg-surface-container-low p-5 outline outline-1 outline-outline-variant/15">
                <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">VRAM</div>
                <div className="font-headline font-bold text-on-surface text-lg">{product.VRAM || '24GB GDDR6X'}</div>
              </div>
              <div className="bg-surface-container-low p-5 outline outline-1 outline-outline-variant/15">
                <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">Boost Clock</div>
                <div className="font-headline font-bold text-secondary text-lg">{product.Boost_Clock || '2640 MHz'}</div>
              </div>
              <div className="bg-surface-container-low p-5 outline outline-1 outline-outline-variant/15">
                <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">Cuda Cores</div>
                <div className="font-headline font-bold text-on-surface text-lg">{product.Cores || '16384'}</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg py-4 px-8 rounded-lg shadow-[0_8px_16px_rgba(0,72,225,0.2)] hover:shadow-[0_12px_24px_rgba(0,72,225,0.3)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 w-full">
                <ShoppingBag className="w-5 h-5" />
                ADD TO CART
              </button>
              <button className="bg-surface-container-lowest text-on-surface font-headline font-bold text-lg py-4 px-8 rounded-lg outline outline-1 outline-outline-variant/30 hover:bg-surface-container-low transition-colors duration-300 flex items-center justify-center gap-3 w-full">
                <Heart className="w-5 h-5" />
                SAVE TO WISHLIST
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-on-surface-variant text-sm font-label">
              <Truck className="w-4 h-4" />
              Free standard shipping on orders over $500.
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="font-display text-3xl font-black text-on-surface tracking-tight mb-12 border-b border-outline-variant/20 pb-4">
            ENGINEERED SPECIFICATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <div>
              <h3 className="font-headline font-bold text-xl mb-6 text-on-surface">GPU Engine Specs</h3>
              <ul className="space-y-4 font-body text-sm">
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">NVIDIA CUDA® Cores</span>
                  <span className="font-medium text-on-surface">{product.Cores || '16384'}</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Boost Clock (GHz)</span>
                  <span className="font-medium text-on-surface">{product.Boost_Clock || '2.52'}</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Base Clock (GHz)</span>
                  <span className="font-medium text-on-surface">{product.Core_Clock || '2.23'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl mb-6 text-on-surface">Memory Specs</h3>
              <ul className="space-y-4 font-body text-sm">
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Standard Memory Config</span>
                  <span className="font-medium text-on-surface">{product.VRAM || '24 GB GDDR6X'}</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Memory Interface Width</span>
                  <span className="font-medium text-on-surface">384-bit</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl mb-6 text-on-surface">Display Support</h3>
              <ul className="space-y-4 font-body text-sm">
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Maximum Resolution</span>
                  <span className="font-medium text-on-surface">7680x4320</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Standard Display Connectors</span>
                  <span className="font-medium text-on-surface">HDMI, 3x DisplayPort</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant">Multi Monitor</span>
                  <span className="font-medium text-on-surface">Up to 4</span>
                </li>
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
    <nav className="bg-surface-bright/80 backdrop-blur-xl sticky top-0 w-full z-50">
      <div className="flex items-center justify-between px-10 py-4 max-w-[1920px] mx-auto">
        <a href="/" className="font-headline font-bold tracking-tighter text-on-surface text-xl uppercase">
          PRECISION TECH
        </a>
        <div className="hidden md:flex gap-8 items-center">
          <a href="/" className="text-on-surface-variant font-headline font-bold hover:text-primary transition-all duration-300 tracking-tight">Home</a>
          <a href="/catalog" className="text-primary font-headline font-bold border-b-2 border-primary pb-1 tracking-tight">Catalog</a>
          <a href="/build" className="text-on-surface-variant font-headline font-bold hover:text-primary transition-all duration-300 tracking-tight">Build</a>
          <a href="/about" className="text-on-surface-variant font-headline font-bold hover:text-primary transition-all duration-300 tracking-tight">About</a>
          <a href="/contact" className="text-on-surface-variant font-headline font-bold hover:text-primary transition-all duration-300 tracking-tight">Support</a>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </button>
          <a href="/cart" className="text-on-surface-variant hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="bg-outline-variant/30 h-[1px] w-full"></div>
    </nav>
  )
}

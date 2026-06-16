import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingBag, Heart, Truck, Star, ArrowLeft } from 'lucide-react'
import { getProduct } from '@/features/catalog/api/catalog'
import { formatPrice } from '@/utils/currency'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'

const SPEC_GROUPS = {
  CPU: [
    {
      title: 'Core Specs',
      keys: ['core_count', 'thread_count', 'core_clock', 'boost_clock'],
    },
    {
      title: 'Cache & Architecture',
      keys: ['l2_cache', 'l3_cache', 'microarchitecture', 'lithography'],
    },
    {
      title: 'Power & Compatibility',
      keys: ['tdp', 'socket', 'max_memory', 'ecc_support'],
    },
  ],
  GPU: [
    {
      title: 'GPU Engine',
      keys: ['chipset', 'core_clock', 'boost_clock', 'interface'],
    },
    {
      title: 'Memory',
      keys: ['memory', 'memory_type'],
    },
    {
      title: 'Power & Size',
      keys: ['tdp', 'length', 'slot_width', 'external_power'],
    },
  ],
  Motherboard: [
    {
      title: 'Form Factor',
      keys: ['socket', 'form_factor', 'chipset', 'color'],
    },
    {
      title: 'Memory Support',
      keys: ['memory_max', 'memory_type', 'memory_slots', 'memory_speed'],
    },
    {
      title: 'Expansion',
      keys: ['pcie_x16_slots', 'm2_slots', 'sata_ports', 'usb_headers'],
    },
  ],
  Memory: [
    {
      title: 'Speed & Timing',
      keys: ['speed', 'cas_latency', 'first_word_latency', 'timing'],
    },
    {
      title: 'Physical',
      keys: ['form_factor', 'modules', 'color', 'heat_spreader'],
    },
    {
      title: 'Other',
      keys: ['voltage', 'ecc_registered', 'price_per_gb'],
    },
  ],
  'Internal Drive': [
    {
      title: 'Capacity & Type',
      keys: ['capacity', 'type', 'form_factor', 'interface'],
    },
    {
      title: 'Sequential Performance',
      keys: ['seq_read_qd1', 'seq_write_qd1', 'seq_read_qd4', 'seq_write_qd4'],
    },
    {
      title: 'Random Performance',
      keys: ['random_read_qd1', 'random_write_qd1', 'random_read_qd32', 'random_write_qd32'],
    },
  ],
  PSU: [
    {
      title: 'Power Delivery',
      keys: ['wattage', 'efficiency', 'type', 'modular'],
    },
    {
      title: 'Connectors',
      keys: ['atx_4pin', 'eps_8pin', 'pcie_8pin', 'pcie_6plus2', 'sata', 'molex'],
    },
    {
      title: 'Physical',
      keys: ['length', 'color', 'fanless'],
    },
  ],
  Case: [
    {
      title: 'Form & Layout',
      keys: ['type', 'color', 'motherboard_form_factor', 'psu_shroud'],
    },
    {
      title: 'Cooling Support',
      keys: ['fan_support', 'included_fans', 'radiator_support'],
    },
    {
      title: 'Dimensions',
      keys: ['max_gpu_length', 'drive_bays', 'dimensions', 'volume'],
    },
  ],
  'CPU Cooler': [
    {
      title: 'Performance',
      keys: ['fan_rpm', 'noise_level', 'height'],
    },
    {
      title: 'Compatibility',
      keys: ['cpu_socket', 'model', 'water_cooled', 'fanless'],
    },
  ],
}

function getImages(urls) {
  if (!urls) return []
  try {
    const parsed = JSON.parse(urls)
    return Array.isArray(parsed) ? parsed : [urls]
  } catch {
    return [urls]
  }
}

export default function ProductDetail() {
  const { tableName, productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedThumb, setSelectedThumb] = useState(0)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProduct(tableName, productId)
        if (!data) throw new Error('Product not found')
        setProduct(data)
      } catch (err) {
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    if (tableName && productId) loadProduct()
  }, [tableName, productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Header />
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Header />
        <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-20 text-center">
          <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} ERROR</span>
          <h1 className="font-headline text-4xl tracking-tight text-on-surface uppercase mt-3">Product Not Found</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-2">{error || 'The requested product does not exist.'}</p>
          <Link to="/catalog" className="inline-block mt-8 bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary-container transition-colors">
            BACK TO CATALOG
          </Link>
        </main>
      </div>
    )
  }

  const images = getImages(product.image_urls)
  const groups = SPEC_GROUPS[product.table_name] || []
  const specs = product.specs || {}

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Header />

      <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <Link to="/catalog" className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" />
          BACK TO CATALOG
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-32">
          {/* Image gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container w-full aspect-video flex items-center justify-center p-8 md:p-12 relative overflow-hidden trace-border">
              {images[selectedThumb] ? (
                <img
                  src={images[selectedThumb]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <span className="font-headline text-6xl text-outline/20">{product.name?.[0] || '?'}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((thumb, i) => (
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
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-1">
              <span className="font-label text-[10px] tracking-[0.15em] text-primary uppercase">
                {product.manufacturer ? `${product.manufacturer} / ` : ''}{product.table_name?.toUpperCase() || 'COMPONENT'}
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl tracking-tight text-on-surface leading-[0.9] mb-4 uppercase">
              {product.name || 'PRODUCT NAME'}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-label text-[10px] tracking-[0.15em] bg-primary/10 text-primary px-3 py-1 uppercase">
                {product.table_name || 'COMPONENT'}
              </span>
            </div>
            <div className="mb-8">
              <span className="font-headline text-3xl md:text-4xl tracking-tight text-primary">
                {formatPrice(product.price)}
              </span>
              {product.stock != null && (
                <span className={`ml-4 font-label text-sm tracking-[0.15em] uppercase ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `IN STOCK (${product.stock})` : 'OUT OF STOCK'}
                </span>
              )}
            </div>

            {/* Quick specs grid — show first 4 specs from the first group */}
            {groups.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {groups[0].keys.slice(0, 4).map((key) => (
                  <div key={key} className="bg-surface-container p-4 trace-border">
                    <div className="font-label text-[11px] text-on-surface-variant tracking-[0.15em] uppercase mb-1">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="font-body text-sm text-on-surface">{specs[key] || 'N/A'}</div>
                  </div>
                ))}
              </div>
            )}

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
              Free standard shipping on orders over RM2,200.
            </div>
          </div>
        </section>

        {/* Full specs sections */}
        {groups.length > 0 && (
          <section className="mb-20 md:mb-32">
            <div className="flex items-center gap-6 mb-8 md:mb-12">
              <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} SPECIFICATIONS</span>
              <h2 className="font-headline text-2xl md:text-4xl tracking-tight text-on-surface uppercase">Engineered Specs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {groups.map((group) => {
                const entries = group.keys.filter(k => specs[k] !== undefined && specs[k] !== '')
                if (entries.length === 0) return null
                return (
                  <div key={group.title} className="trace-border bg-surface-container-lowest p-5 md:p-6">
                    <h3 className="font-label text-m tracking-[0.15em] text-primary uppercase mb-5">{group.title}</h3>
                    <ul className="space-y-3">
                      {entries.map((key) => (
                        <li key={key} className="flex justify-between items-center">
                          <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                          <span className="font-body text-[11px] text-on-surface">{specs[key]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

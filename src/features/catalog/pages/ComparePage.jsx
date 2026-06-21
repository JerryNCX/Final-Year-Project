import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, PackageX, X } from 'lucide-react'
import Header from '@/features/home/components/Header'
import Footer from '@/features/home/components/Footer'
import { getProduct } from '@/features/catalog/api/catalog'
import { formatPrice } from '@/utils/currency'

const SPEC_GROUPS = {
  CPU: [
    { title: 'Core Specs', keys: ['core_count', 'thread_count', 'core_clock', 'boost_clock'] },
    { title: 'Cache & Architecture', keys: ['l2_cache', 'l3_cache', 'microarchitecture', 'lithography'] },
    { title: 'Power & Compatibility', keys: ['tdp', 'socket', 'max_memory', 'ecc_support'] },
  ],
  GPU: [
    { title: 'GPU Engine', keys: ['chipset', 'core_clock', 'boost_clock', 'interface'] },
    { title: 'Memory', keys: ['memory', 'memory_type'] },
    { title: 'Power & Size', keys: ['tdp', 'length', 'slot_width', 'external_power'] },
  ],
  Motherboard: [
    { title: 'Form Factor', keys: ['socket', 'form_factor', 'chipset', 'color'] },
    { title: 'Memory Support', keys: ['memory_max', 'memory_type', 'memory_slots', 'memory_speed'] },
    { title: 'Expansion', keys: ['pcie_x16_slots', 'm2_slots', 'sata_ports', 'usb_headers'] },
  ],
  Memory: [
    { title: 'Speed & Timing', keys: ['speed', 'cas_latency', 'first_word_latency', 'timing'] },
    { title: 'Physical', keys: ['form_factor', 'modules', 'color', 'heat_spreader'] },
    { title: 'Other', keys: ['voltage', 'ecc_registered', 'price_per_gb'] },
  ],
  'Internal Drive': [
    { title: 'Capacity & Type', keys: ['capacity', 'type', 'form_factor', 'interface'] },
    { title: 'Sequential Performance', keys: ['seq_read_qd1', 'seq_write_qd1', 'seq_read_qd4', 'seq_write_qd4'] },
    { title: 'Random Performance', keys: ['random_read_qd1', 'random_write_qd1', 'random_read_qd32', 'random_write_qd32'] },
  ],
  PSU: [
    { title: 'Power Delivery', keys: ['wattage', 'efficiency', 'type', 'modular'] },
    { title: 'Connectors', keys: ['atx_4pin', 'eps_8pin', 'pcie_8pin', 'pcie_6plus2', 'sata', 'molex'] },
    { title: 'Physical', keys: ['length', 'color', 'fanless'] },
  ],
  Case: [
    { title: 'Form & Layout', keys: ['type', 'color', 'motherboard_form_factor', 'psu_shroud'] },
    { title: 'Cooling Support', keys: ['fan_support', 'included_fans', 'radiator_support'] },
    { title: 'Dimensions', keys: ['max_gpu_length', 'drive_bays', 'dimensions', 'volume'] },
  ],
  'CPU Cooler': [
    { title: 'Performance', keys: ['fan_rpm', 'noise_level', 'height'] },
    { title: 'Compatibility', keys: ['cpu_socket', 'model', 'water_cooled', 'fanless'] },
  ],
}

const SPEC_MAP = {
  CPU: [
    { label: 'CORES / THREADS', key: 'core_count', fmt: (v, s) => `${v || '?'} / ${s.thread_count || '?'}` },
    { label: 'BOOST CLOCK', key: 'boost_clock' },
    { label: 'TDP', key: 'tdp' },
    { label: 'SOCKET', key: 'socket' },
  ],
  GPU: [
    { label: 'VRAM', key: 'memory' },
    { label: 'CORE CLOCK', key: 'core_clock' },
    { label: 'TDP', key: 'tdp' },
    { label: 'CHIPSET', key: 'chipset' },
  ],
  Motherboard: [
    { label: 'SOCKET', key: 'socket' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'MEMORY TYPE', key: 'memory_type' },
    { label: 'M.2 SLOTS', key: 'm2_slots' },
  ],
  Memory: [
    { label: 'SPEED', key: 'speed' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'MODULES', key: 'modules' },
    { label: 'CAS LATENCY', key: 'cas_latency' },
  ],
  'Internal Drive': [
    { label: 'CAPACITY', key: 'capacity' },
    { label: 'TYPE', key: 'type' },
    { label: 'FORM FACTOR', key: 'form_factor' },
    { label: 'INTERFACE', key: 'interface' },
  ],
  PSU: [
    { label: 'WATTAGE', key: 'wattage' },
    { label: 'EFFICIENCY', key: 'efficiency' },
    { label: 'MODULAR', key: 'modular' },
    { label: 'TYPE', key: 'type' },
  ],
  Case: [
    { label: 'TYPE', key: 'type' },
    { label: 'MOTHERBOARD', key: 'motherboard_form_factor' },
    { label: 'MAX GPU LENGTH', key: 'max_gpu_length' },
    { label: 'INCLUDED FANS', key: 'included_fans' },
  ],
  'CPU Cooler': [
    { label: 'FAN RPM', key: 'fan_rpm' },
    { label: 'HEIGHT', key: 'height' },
    { label: 'SOCKET', key: 'cpu_socket' },
    { label: 'NOISE LEVEL', key: 'noise_level' },
  ],
}

function getFirstImage(urls) {
  if (!urls) return null
  try {
    const parsed = JSON.parse(urls)
    return Array.isArray(parsed) ? parsed[0] : null
  } catch {
    return urls || null
  }
}

function StockBadge({ stock }) {
  if (stock == null) return null
  const color = stock > 5 ? 'bg-green-600' : stock > 0 ? 'bg-amber-500' : 'bg-red-600'
  const label = stock > 5 ? 'In Stock' : stock > 0 ? `Low: ${stock}` : 'Out of Stock'
  return <span className={`${color} text-white font-label text-[10px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm whitespace-nowrap`}>{label}</span>
}

function productsAllSame(products, key) {
  if (products.length < 2) return false
  const first = products[0].specs?.[key]
  return products.every(p => p.specs?.[key] === first)
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const ids = searchParams.getAll('ids')

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      if (ids.length < 2) {
        setResults([])
        setLoading(false)
        return
      }
      const entries = ids.map(raw => {
        const dash = raw.lastIndexOf('-')
        return { raw, tableName: raw.slice(0, dash), productId: raw.slice(dash + 1) }
      })
      const settled = await Promise.allSettled(
        entries.map(e => getProduct(e.tableName, e.productId))
      )
      setResults(
        entries.map((e, i) => {
          const r = settled[i]
          return {
            ...e,
            status: r.status === 'fulfilled' ? 'fulfilled' : 'rejected',
            product: r.status === 'fulfilled' ? r.value : null,
            error: r.status === 'rejected' ? (r.reason?.message || 'Failed to load') : null,
          }
        })
      )
      setLoading(false)
    }
    loadProducts()
  }, [ids.join(',')])

  const handleRemove = (raw) => {
    const next = ids.filter(i => i !== raw)
    const params = new URLSearchParams()
    next.forEach(i => params.append('ids', i))
    setSearchParams(params, { replace: true })
  }

  const fulfilled = results.filter(r => r.status === 'fulfilled' && r.product)

  const groups = {}
  for (const r of fulfilled) {
    const cat = r.product.table_name
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(r)
  }
  const sortedCats = Object.keys(groups).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Header />
        <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-surface-container w-48" />
            <div className="h-4 bg-surface-container w-32" />
            <div className="grid grid-cols-4 gap-6 mt-10">
              {[1,2,3,4].map(i => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-surface-container" />
                  <div className="h-4 bg-surface-container w-3/4" />
                  <div className="h-3 bg-surface-container w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-surface text-on-surface font-body">
        <Header />
        <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-20 text-center">
          <PackageX className="w-16 h-16 mx-auto text-outline/30 mb-6" />
          <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} COMPARE</span>
          <h1 className="font-headline text-4xl tracking-tight text-on-surface uppercase mt-3">Not Enough Products</h1>
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-2">Select at least 2 products to compare.</p>
          <Link to="/catalog" className="inline-block mt-8 bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary-container transition-colors">
            BROWSE PRODUCTS
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const failedCount = results.filter(r => r.status === 'rejected').length

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Header />

      <main className="max-w-[1920px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <Link to="/catalog" className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-3 h-3" />
          BACK TO CATALOG
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} COMPARE</span>
            <h1 className="font-headline text-3xl md:text-4xl tracking-tight text-on-surface uppercase mt-1">
              Compare Products
              <span className="text-on-surface-variant font-body text-base ml-3 font-normal lowercase">({fulfilled.length} products)</span>
            </h1>
          </div>
          <Link to="/catalog" className="font-label text-[11px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-colors">
            + ADD MORE
          </Link>
        </div>

        {failedCount > 0 && (
          <div className="flex items-center gap-3 bg-red-600/10 border border-red-600/30 px-4 py-3 mb-8">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-label text-[11px] tracking-[0.1em] text-red-500 uppercase">
              {failedCount} product{failedCount > 1 ? 's' : ''} failed to load.
            </span>
          </div>
        )}

        {fulfilled.length < 2 ? (
          <div className="text-center py-20">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Not enough products to compare after loading errors.</p>
            <Link to="/catalog" className="inline-block mt-6 bg-primary text-on-primary font-label text-xs tracking-[0.15em] uppercase px-8 py-3 hover:bg-primary-container transition-colors">
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          sortedCats.map(cat => {
            const items = groups[cat]
            const specGroups = SPEC_GROUPS[cat] || []
            const specMap = SPEC_MAP[cat] || []
            return (
              <section key={cat} className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} {cat.toUpperCase()}</span>
                  <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">{items.length} PRODUCTS</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-outline/10">
                        <th className="w-[160px] p-3 font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase sticky left-0 bg-surface z-10" />
                        {items.map(r => (
                          <th key={r.raw} className="p-3 min-w-[180px] align-top">
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="w-24 h-24 bg-surface-container flex items-center justify-center p-3 mb-1">
                                {(() => {
                                  const img = getFirstImage(r.product.image_urls)
                                  return img
                                    ? <img src={img} alt="" className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    : <span className="font-headline text-2xl text-outline/20">{r.product.name?.[0] || '?'}</span>
                                })()}
                              </div>
                              <div className="font-label text-[10px] text-primary tracking-[0.15em] uppercase">{r.product.manufacturer || 'GENERIC'}</div>
                              <div className="font-body text-sm text-on-surface leading-tight">{r.product.name}</div>
                              <div className="font-headline text-lg tracking-tight text-primary">{formatPrice(r.product.price)}</div>
                              <StockBadge stock={r.product.stock} />
                              <button
                                onClick={() => handleRemove(r.raw)}
                                className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant/60 hover:text-red-500 transition-colors flex items-center gap-1 mt-1"
                              >
                                <X className="w-3 h-3" />
                                REMOVE
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {specMap.length > 0 && (
                      <tbody>
                        <tr className="border-b border-outline/10">
                          <td className="p-3 font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase sticky left-0 bg-surface z-10">
                            QUICK SPECS
                          </td>
                          {items.map(r => (
                            <td key={r.raw} className="p-3">
                              <div className="space-y-1">
                                {specMap.map(s => (
                                  <div key={s.key} className="flex justify-between gap-2 text-[11px]">
                                    <span className="text-on-surface-variant/60">{s.label}</span>
                                    <span className="text-on-surface font-medium">
                                      {s.fmt
                                        ? s.fmt(r.product.specs?.[s.key], r.product.specs)
                                        : r.product.specs?.[s.key] || 'N/A'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    )}

                    {specGroups.map(group => {
                      const validKeys = group.keys.filter(k =>
                        items.every(r => r.product.specs?.[k] !== undefined && r.product.specs?.[k] !== '')
                      )
                      if (validKeys.length === 0) return null
                      return (
                        <tbody key={group.title}>
                          <tr>
                            <td
                              colSpan={items.length + 1}
                              className="p-3 pt-6 font-label text-[11px] tracking-[0.15em] text-primary uppercase bg-surface-container-lowest/50"
                            >
                              {group.title}
                            </td>
                          </tr>
                          {validKeys.map(key => {
                            const allSame = productsAllSame(items.map(r => ({ specs: r.product.specs })), key)
                            return (
                              <tr key={key} className={`border-b border-outline/5 ${allSame ? '' : 'bg-primary/[0.03]'}`}>
                                <td className={`p-3 font-label text-[11px] tracking-[0.1em] uppercase sticky left-0 bg-surface z-10 ${allSame ? 'text-on-surface-variant/50' : 'text-on-surface-variant'}`}>
                                  {key.replace(/_/g, ' ')}
                                </td>
                                {items.map(r => (
                                  <td key={`${r.raw}-${key}`} className={`p-3 font-body text-sm ${allSame ? 'text-on-surface/40' : 'text-on-surface'}`}>
                                    {r.product.specs?.[key] || 'N/A'}
                                  </td>
                                ))}
                              </tr>
                            )
                          })}
                        </tbody>
                      )
                    })}
                  </table>
                </div>
              </section>
            )
          })
        )}
      </main>

      <Footer />
    </div>
  )
}

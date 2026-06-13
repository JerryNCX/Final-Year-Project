import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { ShoppingBag, Edit, Trash2, Plus, Save, FolderOpen, Share2, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../HomePage/Header'
import Footer from '../HomePage/Footer'
import { useBuild, CATEGORIES } from '@/lib/BuildContext'
import { useCart } from '@/lib/CartContext'
import { suggestCompatible } from '@/lib/api'
import { formatPrice, parsePrice } from '@/lib/currency'

const CATEGORY_META = {
  CPU: { label: 'CPU', icon: '⚡' },
  GPU: { label: 'GPU', icon: '🎮' },
  Motherboard: { label: 'Motherboard', icon: '🔌' },
  Memory: { label: 'Memory', icon: '🧠' },
  'CPU Cooler': { label: 'CPU Cooler', icon: '❄️' },
  Case: { label: 'Case', icon: '🖥️' },
  PSU: { label: 'Power Supply', icon: '🔋' },
  'Internal Drive': { label: 'Storage', icon: '💾' },
}

const URL_CATEGORY_MAP = {
  CPU: 'cpu', GPU: 'gpu', Motherboard: 'motherboard',
  Memory: 'memory', Case: 'case', PSU: 'psu',
  'CPU Cooler': 'cpu-cooler', 'Internal Drive': 'internal-drive',
}

function extractInt(val) {
  if (val == null) return null
  const m = String(val).match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

export default function PCBuildPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { build, removeComponent, resetBuild, buildCount, savedBuilds, saveCurrentBuild, loadLocalBuild, deleteLocalBuild, cloudBuilds, deleteCloudBuild, applyBuild } = useBuild()
  const { replaceBuild, checkBuildConflict } = useCart()
  const [suggestions, setSuggestions] = useState({})
  const [checking, setChecking] = useState({})
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [showLoadPanel, setShowLoadPanel] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [showReplaceModal, setShowReplaceModal] = useState(false)

  useEffect(() => {
    const encoded = searchParams.get('data')
    if (encoded) {
      try {
        const json = decodeURIComponent(atob(encoded))
        const data = JSON.parse(json)
        applyBuild(data)
        window.history.replaceState({}, '', '/build')
      } catch {}
    }
  }, [])

  const handleProceedToCart = () => {
    if (checkBuildConflict()) {
      setShowReplaceModal(true)
    } else {
      replaceBuild(build)
      navigate('/cart')
    }
  }

  const handleConfirmReplace = () => {
    setShowReplaceModal(false)
    replaceBuild(build)
    navigate('/cart')
  }

  const totalPrice = useMemo(() => {
    return CATEGORIES.reduce((sum, cat) => {
      const v = build[cat]
      if (!v) return sum
      if (Array.isArray(v)) return sum + v.reduce((s, p) => s + parsePrice(p.price), 0)
      return sum + parsePrice(v.price)
    }, 0)
  }, [build])

  const selectedCount = CATEGORIES.reduce((sum, cat) => {
    const v = build[cat]
    if (!v) return sum
    return sum + (Array.isArray(v) ? v.length : 1)
  }, 0)

  useEffect(() => {
    CATEGORIES.forEach(cat => {
      const comp = build[cat]
      if (!comp || (Array.isArray(comp) && comp.length === 0)) return
      const item = Array.isArray(comp) ? comp[0] : comp
      if (suggestions[item.id]) return
      setChecking(prev => ({ ...prev, [item.id]: true }))
      suggestCompatible(item.table_name, item.id)
        .then(res => {
          setSuggestions(prev => ({ ...prev, [item.id]: res }))
        })
        .catch(() => {})
        .finally(() => {
          setChecking(prev => ({ ...prev, [item.id]: false }))
        })
    })
  }, [build])

  const compatibilityBadges = useMemo(() => {
    const badges = []
    let totalTdp = 0
    let hasPsu = false
    let psuWattage = 0

    CATEGORIES.forEach(cat => {
      const comp = build[cat]
      if (!comp || (Array.isArray(comp) && comp.length === 0)) return
      const item = Array.isArray(comp) ? comp[0] : comp

      if (cat === 'CPU' || cat === 'GPU') {
        const tdp = extractInt(item.specs?.tdp) || 0
        totalTdp += tdp
      }
      if (cat === 'PSU') {
        hasPsu = true
        psuWattage = extractInt(item.specs?.wattage) || 0
      }
    })

    CATEGORIES.forEach(cat => {
      const comp = build[cat]
      const item = Array.isArray(comp) ? (comp.length > 0 ? comp[0] : null) : comp
      if (!item) {
        badges.push({ category: cat, status: 'empty', message: `${CATEGORY_META[cat]?.label || cat} not selected` })
        return
      }

      const sug = suggestions[item.id]
      if (sug && !sug.error) {
        const hasIssue = CATEGORIES.some(otherCat => {
          if (otherCat === cat) return false
          const otherComp = build[otherCat]
          if (!otherComp || (Array.isArray(otherComp) && otherComp.length === 0)) return false
          const key = otherCat.toLowerCase().replace(/\s+/g, '_')
          const list = sug[key]
          return list && list.length === 0
        })
        if (hasIssue) {
          badges.push({ category: cat, status: 'warning', message: `⚠️ ${CATEGORY_META[cat]?.label || cat} — potential incompatibility detected` })
        } else {
          badges.push({ category: cat, status: 'ok', message: `✅ ${CATEGORY_META[cat]?.label || cat} selected` })
        }
      } else if (checking[item.id]) {
        badges.push({ category: cat, status: 'checking', message: `⏳ Checking ${CATEGORY_META[cat]?.label || cat}...` })
      } else {
        badges.push({ category: cat, status: 'ok', message: `✅ ${CATEGORY_META[cat]?.label || cat} selected` })
      }
    })

    if (totalTdp > 0) {
      const recommended = totalTdp + 200
      badges.push({
        category: 'power',
        status: hasPsu && psuWattage >= recommended ? 'ok' : 'warning',
        message: hasPsu
          ? (psuWattage >= recommended ? `✅ Estimated wattage: ${totalTdp}W (PSU: ${psuWattage}W — sufficient)` : `⚠️ Estimated wattage: ${totalTdp}W (PSU: ${psuWattage}W — may be insufficient, recommend ${recommended}W+)`)
          : `⚡ Estimated wattage: ${totalTdp}W / Recommended PSU: ${recommended}W+`,
      })
    }

    return badges
  }, [build, suggestions, checking])

  const handleChoose = (category) => {
    const urlKey = URL_CATEGORY_MAP[category]
    navigate(`/build/choose/${urlKey}`)
  }

  const handleRemove = (category, productId) => {
    removeComponent(category, productId)
  }

  const handleSave = async () => {
    if (!saveName.trim()) return
    await saveCurrentBuild(saveName.trim())
    setSaveName('')
    setShowSaveModal(false)
  }

  const handleShare = async () => {
    try {
      const encoded = btoa(JSON.stringify(build))
      const shareUrl = `${window.location.origin}/build?data=${encodeURIComponent(encoded)}`
      await navigator.clipboard.writeText(shareUrl)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      <Header />
      <div className="max-w-[1400px] mx-auto px-10 py-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-on-surface mb-2">SYSTEM BUILDER</h1>
            <p className="text-on-surface-variant text-base max-w-2xl">
              Configure your high-performance rig. {selectedCount} of 8 slots filled.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowLoadPanel(!showLoadPanel)} className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
              <FolderOpen className="w-4 h-4" />
              Load
            </button>
            <button onClick={() => setShowSaveModal(true)} disabled={selectedCount === 0} className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button onClick={handleShare} className="relative flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
              <Share2 className="w-4 h-4" />
              {copyFeedback ? 'Copied!' : 'Share'}
            </button>
            <button onClick={resetBuild} className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-10 flex-wrap">
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-lg">
            <span className="text-sm font-label text-on-surface-variant">Components</span>
            <span className="text-sm font-label text-on-surface font-bold">{selectedCount}/8</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-lg">
            <span className="text-sm font-label text-on-surface-variant">Total</span>
            <span className="text-sm font-headline text-on-surface font-bold">{formatPrice(totalPrice)}</span>
          </div>
          <button onClick={handleProceedToCart} className="ml-auto primary-gradient-btn flex items-center gap-2 px-8 py-2.5 text-on-primary font-label font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed" disabled={selectedCount === 0}>
            <ShoppingBag className="w-4 h-4" />
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="ghost-border rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-[1fr_200px_120px] gap-0 bg-surface-container-low border-b border-outline-variant/30">
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Component</div>
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Selection</div>
            <div className="px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Price</div>
          </div>

          {CATEGORIES.map(category => {
            const selected = build[category]
            const hasSelection = selected && (Array.isArray(selected) ? selected.length > 0 : true)
            return (
              <div key={category} className="grid grid-cols-[1fr_200px_120px] gap-0 border-b border-outline-variant/15 last:border-b-0 hover:bg-surface-container-low/40 transition-colors">
                <div className="px-8 py-5">
                  <span className="font-headline font-bold text-on-surface">{CATEGORY_META[category]?.label || category}</span>
                  {hasSelection && Array.isArray(selected) ? (
                    selected.map(p => (
                      <div key={p.id} className="flex items-center justify-between text-sm text-on-surface-variant mt-0.5 group">
                        <span className="truncate mr-2">{p.name}</span>
                        <button onClick={() => handleRemove(category, p.id)} className="text-on-surface-variant hover:text-error transition-colors flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  ) : hasSelection ? (
                    <div className="text-sm text-on-surface-variant mt-0.5">{selected.name}</div>
                  ) : null}
                </div>
                <div className="px-8 py-5 flex items-center justify-end">
                  {hasSelection ? (
                    <div className="flex gap-3">
                      <button onClick={() => handleChoose(category)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button onClick={() => handleRemove(category, Array.isArray(selected) ? selected[0]?.id : selected.id)} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-error transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleChoose(category)} className="flex items-center gap-1.5 text-sm font-label text-primary hover:text-primary-fixed-dim transition-colors">
                      <Plus className="w-4 h-4" />
                      Choose
                    </button>
                  )}
                </div>
                <div className="px-8 py-5 flex items-center justify-end">
                  <span className="font-headline font-bold text-on-surface">
                    {hasSelection ? (
                      Array.isArray(selected)
                        ? formatPrice(selected.reduce((s, p) => s + parsePrice(p.price), 0))
                        : formatPrice(parsePrice(selected.price))
                    ) : '\u2014'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {showReplaceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowReplaceModal(false)}>
            <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-outline-variant/20" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-2">Replace Existing Build?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A PC build is already in your cart. Replacing it will remove the current build and add this one instead. Your individual component items will be kept.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={handleConfirmReplace} className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white font-label text-sm px-5 py-3 rounded-lg hover:bg-amber-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  REPLACE BUILD
                </button>
                <button onClick={() => setShowReplaceModal(false)} className="flex-1 flex items-center justify-center gap-2 border border-outline-variant text-on-surface font-label text-sm px-5 py-3 rounded-lg hover:bg-surface-container-high transition-colors">
                  <X className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-surface rounded-xl p-8 w-full max-w-md shadow-2xl border border-outline-variant/15">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline font-bold text-xl text-on-surface">Save Build</h3>
                <button onClick={() => setShowSaveModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                autoFocus
                className="w-full bg-surface-container-low text-on-surface font-body px-4 py-3 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors mb-6"
                placeholder="Enter build name..."
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSaveModal(false)} className="px-5 py-2.5 border border-outline-variant rounded-lg text-sm font-label text-on-surface hover:bg-surface-container-high transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!saveName.trim()} className="primary-gradient-btn px-5 py-2.5 text-on-primary font-label font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showLoadPanel && (
          <div className="ghost-border rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-base text-on-surface">Saved Builds</h3>
              <button onClick={() => setShowLoadPanel(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {savedBuilds.length === 0 && cloudBuilds.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No saved builds yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {savedBuilds.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                    <div>
                      <span className="font-label text-sm text-on-surface">{entry.name}</span>
                      <span className="text-xs text-on-surface-variant ml-3">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { loadLocalBuild(entry.id); setShowLoadPanel(false) }} className="text-xs font-label text-primary hover:text-primary-fixed-dim transition-colors px-3 py-1 border border-outline-variant/30 rounded">
                        Load
                      </button>
                      <button onClick={() => deleteLocalBuild(entry.id)} className="text-xs font-label text-error hover:text-error/80 transition-colors px-3 py-1 border border-outline-variant/30 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {cloudBuilds.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors border border-primary/10">
                    <div>
                      <span className="font-label text-sm text-on-surface">{entry.name}</span>
                      <span className="text-xs text-primary ml-3">Cloud</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { /* cloud load */ setShowLoadPanel(false) }} className="text-xs font-label text-primary hover:text-primary-fixed-dim transition-colors px-3 py-1 border border-outline-variant/30 rounded">
                        Load
                      </button>
                      <button onClick={() => deleteCloudBuild(entry.id)} className="text-xs font-label text-error hover:text-error/80 transition-colors px-3 py-1 border border-outline-variant/30 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {compatibilityBadges.length > 0 && (
          <div className="ghost-border rounded-xl p-6">
            <h3 className="font-headline font-bold text-base text-on-surface mb-4">Compatibility Overview</h3>
            <div className="flex flex-wrap gap-3">
              {compatibilityBadges.map((badge, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg text-sm font-label ${
                    badge.status === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' :
                    badge.status === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    badge.status === 'empty' ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30' :
                    'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  {badge.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

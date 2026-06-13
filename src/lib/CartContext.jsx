import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getCart, syncCart, setCartBuild, addCartItem, removeCartItem, clearCartOnServer } from '@/lib/api'

export const CartContext = createContext(null)
const LOCAL_KEY = 'pc_cart_anonymous'

function formatCategory(tableName) {
  const map = {
    CPU: 'CPU \u2022 Socket AM5',
    GPU: 'GPU \u2022 PCIe 4.0',
    Motherboard: 'Motherboard',
    Memory: 'RAM \u2022 DDR5',
    Case: 'Case',
    PSU: 'Power Supply',
    'CPU Cooler': 'CPU Cooler',
    'Internal Drive': 'Storage',
  }
  return map[tableName] || tableName
}

function extractSpecs(specs) {
  const result = []
  if (!specs) return result
  if (specs.tdp) result.push({ label: `${specs.tdp} TDP`, variant: 'default' })
  if (specs.speed || specs.speed_rating) result.push({ label: specs.speed || specs.speed_rating, variant: 'default' })
  if (specs.capacity) result.push({ label: specs.capacity, variant: 'default' })
  if (specs.core_count) result.push({ label: `${specs.core_count}C`, variant: 'default' })
  if (specs.wattage) result.push({ label: `${specs.wattage}W`, variant: 'secondary' })
  return result
}

function parsePrice(price) {
  if (!price) return 0
  return parseFloat(String(price).replace(/[$,]/g, '')) || 0
}

function formatPrice(val) {
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function buildItem(tableName, product, fromBuild) {
  return {
    id: `${tableName}-${product.id}-${fromBuild ? 'build' : 'cat'}-${Date.now()}`,
    _productId: product.id,
    _tableName: tableName,
    from_build: fromBuild,
    image: Array.isArray(product.image_urls) && product.image_urls.length > 0 ? product.image_urls[0] : '',
    category: formatCategory(tableName),
    name: product.name,
    sku: `SKU: ${tableName}-${product.id}`,
    specs: extractSpecs(product.specs),
    quantity: 1,
    price: parsePrice(product.price),
    total: parsePrice(product.price),
    qty: 1,
    product_data: { name: product.name, price: product.price, image_urls: product.image_urls, manufacturer: product.manufacturer, specs: product.specs },
  }
}

function enrichFromServer(item) {
  const pd = item.product_data || {}
  return {
    id: item.id,
    _productId: item.product_id,
    _tableName: item.table_name,
    from_build: item.from_build,
    image: Array.isArray(pd.image_urls) && pd.image_urls.length > 0 ? pd.image_urls[0] : '',
    category: formatCategory(item.table_name),
    name: pd.name || `${item.table_name} #${item.product_id}`,
    sku: `SKU: ${item.table_name}-${item.product_id}`,
    specs: extractSpecs(pd.specs),
    quantity: item.quantity,
    price: parsePrice(pd.price),
    total: parsePrice(pd.price) * item.quantity,
    qty: item.quantity,
    product_data: pd,
  }
}

function toServerPayload(item) {
  return {
    table_name: item._tableName,
    product_id: item._productId,
    quantity: item.quantity || item.qty || 1,
    from_build: item.from_build || false,
    product_data: item.product_data || {},
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveLocal(items) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)) } catch {}
}

function clearLocal() {
  try { localStorage.removeItem(LOCAL_KEY) } catch {}
}

function mergeItems(serverItems, localItems) {
  const map = new Map()
  for (const item of serverItems) {
    map.set(`${item._tableName}-${item._productId}-${item.from_build}`, item)
  }
  for (const item of localItems) {
    const key = `${item._tableName}-${item._productId}-${item.from_build}`
    if (map.has(key)) {
      const existing = map.get(key)
      map.set(key, { ...existing, quantity: existing.quantity + item.quantity, qty: existing.qty + item.qty })
    } else {
      map.set(key, item)
    }
  }
  return Array.from(map.values())
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const prevAuth = useRef(null)
  const syncTimer = useRef(null)

  const applyItems = useCallback((items) => {
    setCartItems(items.map(item => {
      if (item.product_data) return enrichFromServer(item)
      return item
    }))
  }, [])

  const loadFromServer = useCallback(async () => {
    try {
      const res = await getCart()
      const server = (res.data || []).map(enrichFromServer)
      const local = loadLocal()
      if (local.length > 0) {
        const merged = mergeItems(server, local)
        await syncCart(merged.map(toServerPayload))
        clearLocal()
        applyItems(merged)
      } else {
        applyItems(server)
      }
    } catch {
      applyItems(loadLocal())
    }
    setInitialLoading(false)
  }, [applyItems])

  useEffect(() => {
    if (isAuthenticated) {
      loadFromServer()
    } else {
      applyItems(loadLocal())
      setInitialLoading(false)
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, loadFromServer, applyItems])

  const persist = useCallback((items) => {
    if (isAuthenticated) {
      if (syncTimer.current) clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => {
        syncCart(items.map(toServerPayload)).catch(() => {})
      }, 800)
    } else {
      saveLocal(items)
    }
  }, [isAuthenticated])

  const addToCart = useCallback((build) => {
    const entries = Object.entries(build).filter(([, v]) => {
      if (!v) return false
      if (Array.isArray(v)) return v.length > 0
      return true
    })
    const isSingleCatalog = entries.length === 1
    if (isSingleCatalog) {
      const [tableName, product] = entries[0]
      const productObj = Array.isArray(product) ? product[0] : product
      const item = buildItem(tableName, productObj, false)
      setCartItems(prev => {
        const existing = prev.find(i => i._tableName === tableName && i._productId === productObj.id && !i.from_build)
        if (existing) {
          const next = prev.map(i =>
            i.id === existing.id ? { ...i, quantity: i.quantity + 1, qty: i.qty + 1, total: i.price * (i.quantity + 1) } : i
          )
          persist(next)
          return next
        }
        const next = [...prev, item]
        persist(next)
        return next
      })
      return { conflict: false }
    }
    const currentBuildItems = cartItems.filter(i => i.from_build)
    if (currentBuildItems.length > 0) {
      return { conflict: true }
    }
    const items = entries.flatMap(([tableName, value]) => {
      const vals = Array.isArray(value) ? value : [value]
      return vals.map(p => buildItem(tableName, p, true))
    })
    setCartItems(prev => {
      const filtered = prev.filter(i => !i.from_build)
      const next = [...filtered, ...items]
      persist(next)
      return next
    })
    return { conflict: false }
  }, [cartItems, persist])

  const replaceBuild = useCallback((build) => {
    const entries = Object.entries(build).filter(([, v]) => {
      if (!v) return false
      if (Array.isArray(v)) return v.length > 0
      return true
    })
    const items = entries.flatMap(([tableName, value]) => {
      const vals = Array.isArray(value) ? value : [value]
      return vals.map(p => buildItem(tableName, p, true))
    })
    setCartItems(prev => {
      const filtered = prev.filter(i => !i.from_build)
      const next = [...filtered, ...items]
      persist(next)
      return next
    })
  }, [persist])

  const addCatalogItem = useCallback((product, tableName) => {
    const item = buildItem(tableName, product, false)
    setCartItems(prev => {
      const existing = prev.find(i => i._tableName === tableName && i._productId === product.id && !i.from_build)
      if (existing) {
        const next = prev.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1, qty: i.qty + 1, total: i.price * (i.quantity + 1) } : i
        )
        persist(next)
        return next
      }
      const next = [...prev, item]
      persist(next)
      return next
    })
  }, [persist])

  const checkBuildConflict = useCallback(() => {
    return cartItems.some(i => i.from_build)
  }, [cartItems])

  const updateQuantity = useCallback((id, delta) => {
    setCartItems(prev => {
      const next = prev.map(item => {
        if (item.id !== id) return item
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty, qty: newQty, total: item.price * newQty }
      })
      persist(next)
      return next
    })
  }, [persist])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => {
      const next = prev.filter(item => item.id !== id)
      persist(next)
      return next
    })
  }, [persist])

  const clearCart = useCallback(() => {
    setCartItems([])
    if (isAuthenticated) {
      clearCartOnServer().catch(() => {})
    } else {
      clearLocal()
    }
  }, [isAuthenticated])

  const cartCount = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems])
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.total, 0), [cartItems])
  const tax = useMemo(() => subtotal * 0.08, [subtotal])
  const cartTotal = useMemo(() => subtotal + tax, [subtotal, tax])

  const value = useMemo(() => ({
    cartItems, addToCart, replaceBuild, addCatalogItem, checkBuildConflict,
    updateQuantity, removeFromCart, clearCart, initialLoading,
    cartCount, subtotal, tax, cartTotal, formatPrice,
  }), [cartItems, addToCart, replaceBuild, addCatalogItem, checkBuildConflict,
      updateQuantity, removeFromCart, clearCart, initialLoading,
      cartCount, subtotal, tax, cartTotal])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

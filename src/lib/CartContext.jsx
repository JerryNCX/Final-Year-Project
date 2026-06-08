import { createContext, useContext, useState, useCallback, useMemo } from 'react'

export const CartContext = createContext(null)

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

function extractSpecs(specs, tableName) {
  const result = []
  if (!specs) return result
  if (specs.tdp) result.push({ label: `${specs.tdp} TDP`, variant: 'default' })
  if (specs.speed || specs.speed_rating) result.push({ label: specs.speed || specs.speed_rating, variant: 'default' })
  if (specs.capacity) result.push({ label: specs.capacity, variant: 'default' })
  if (specs.core_count) result.push({ label: `${specs.core_count}C`, variant: 'default' })
  if (specs.wattage) result.push({ label: `${specs.wattage}W`, variant: 'secondary' })
  if (result.length === 0) result.push({ label: tableName, variant: 'default' })
  return result
}

function parsePrice(price) {
  if (!price) return 0
  return parseFloat(String(price).replace(/[$,]/g, '')) || 0
}

function formatPrice(val) {
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((build) => {
    const entries = Object.entries(build).filter(([, v]) => {
      if (!v) return false
      if (Array.isArray(v)) return v.length > 0
      return true
    })

    const items = entries.flatMap(([tableName, value]) => {
      const items = Array.isArray(value) ? value : [value]
      return items.map(p => ({
        id: `${tableName}-${p.id}`,
        _productId: p.id,
        _tableName: tableName,
        image: Array.isArray(p.image_urls) && p.image_urls.length > 0 ? p.image_urls[0] : '',
        category: formatCategory(tableName),
        name: p.name,
        sku: `SKU: ${tableName}-${p.id}`,
        specs: extractSpecs(p.specs, tableName),
        quantity: 1,
        price: parsePrice(p.price),
        total: parsePrice(p.price),
        qty: 1,
      }))
    })

    setCartItems(items)
  }, [])

  const updateQuantity = useCallback((id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const newQty = Math.max(1, item.quantity + delta)
      return { ...item, quantity: newQty, total: item.price * newQty, qty: newQty }
    }))
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems])
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.total, 0), [cartItems])
  const tax = useMemo(() => subtotal * 0.08, [subtotal])
  const cartTotal = useMemo(() => subtotal + tax, [subtotal, tax])

  const value = useMemo(() => ({
    cartItems, addToCart, updateQuantity, removeFromCart, clearCart,
    cartCount, subtotal, tax, cartTotal, formatPrice,
  }), [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, subtotal, tax, cartTotal])

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

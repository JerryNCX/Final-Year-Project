const USD_TO_MYR = 4.40

export function formatPrice(val) {
  if (val == null) return 'RM0.00'
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.]/g, '')) : Number(val)
  if (isNaN(num)) return 'RM0.00'
  const converted = num * USD_TO_MYR
  return `RM${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function parsePrice(price) {
  return parseFloat(String(price).replace(/[$,RM]/g, '')) || 0
}

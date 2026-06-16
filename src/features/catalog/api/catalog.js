import { request, getAccessToken } from '@/lib/client'

export async function analyzeImage(file) {
  const form = new FormData()
  form.append('file', file)
  return request('/analyze', { method: 'POST', body: form })
}

export async function searchProducts({ q = '', category = null, limit = 20, offset = 0, sort_by = 'default', in_stock_first = true } = {}) {
  const params = new URLSearchParams({ q, limit, offset, sort_by, in_stock_first })
  if (category) params.set('category', category)
  return request(`/search?${params}`)
}

export async function getCategories() {
  return request('/categories')
}

export async function getBrands() {
  return request('/brands')
}

export async function getProduct(tableName, productId) {
  return request(`/products/${tableName}/${productId}`)
}

export async function suggestCompatible(table, id) {
  return request('/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, id }),
  })
}

export async function compatibleProducts({ from_table, from_id, target_table, limit = 20, offset = 0, context_cpu_id = null, context_gpu_id = null } = {}) {
  const params = new URLSearchParams({ from_table, from_id, target_table, limit, offset })
  if (context_cpu_id) params.set('context_cpu_id', context_cpu_id)
  if (context_gpu_id) params.set('context_gpu_id', context_gpu_id)
  return request(`/compatible-products?${params}`)
}

export async function calculateShipping(destZip, originZip = '50000') {
  return request('/shipping/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin_zip: originZip, dest_zip: destZip }),
  })
}

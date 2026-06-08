import { supabase } from './supabase-client'

const BASE = ''

async function request(url, options = {}) {
  const headers = { ...options.headers }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers,
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json()
}

export async function analyzeImage(file) {
  const form = new FormData()
  form.append('file', file)
  return request('/analyze', { method: 'POST', body: form })
}

export async function searchProducts({ q = '', category = null, limit = 20, offset = 0, sort_by = 'default' } = {}) {
  const params = new URLSearchParams({ q, limit, offset, sort_by })
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

async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token
}

export async function adminUpdateProduct(tableName, productId, data) {
  const token = await getAccessToken()
  return request(`/admin/products/${tableName}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    token,
  })
}

export async function adminDeleteProduct(tableName, productId) {
  const token = await getAccessToken()
  return request(`/admin/products/${tableName}/${productId}`, {
    method: 'DELETE',
    token,
  })
}

export async function healthCheck() {
  return request('/health')
}

export async function saveBuild(name, components) {
  const token = await getAccessToken()
  return request('/api/builds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, components }),
    token,
  })
}

export async function listBuilds() {
  const token = await getAccessToken()
  return request('/api/builds', { token })
}

export async function getBuild(buildId) {
  const token = await getAccessToken()
  return request(`/api/builds/${buildId}`, { token })
}

export async function deleteBuild(buildId) {
  const token = await getAccessToken()
  return request(`/api/builds/${buildId}`, { method: 'DELETE', token })
}

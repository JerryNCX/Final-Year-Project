import { supabase } from './supabase'

const BASE = ''

export async function request(url, options = {}) {
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

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token
}

import { request, getAccessToken } from '@/lib/client'

export async function getCart() {
  const token = await getAccessToken()
  return request('/api/cart', { token })
}

export async function syncCart(items) {
  const token = await getAccessToken()
  return request('/api/cart/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
    token,
  })
}

export async function addCartItem(tableName, productId, quantity = 1) {
  const token = await getAccessToken()
  return request('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table_name: tableName, product_id: productId, quantity }),
    token,
  })
}

export async function removeCartItem(itemId) {
  const token = await getAccessToken()
  return request(`/api/cart/items/${itemId}`, { method: 'DELETE', token })
}

export async function setCartBuild(items) {
  const token = await getAccessToken()
  return request('/api/cart/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
    token,
  })
}

export async function clearCartOnServer() {
  const token = await getAccessToken()
  return request('/api/cart', { method: 'DELETE', token })
}

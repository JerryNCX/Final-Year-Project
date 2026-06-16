import { request, getAccessToken } from '@/lib/client'

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

export async function adminListOrders() {
  const token = await getAccessToken()
  return request('/admin/orders', { token })
}

export async function adminUpdateOrderStatus(orderId, status) {
  const token = await getAccessToken()
  return request(`/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    token,
  })
}

export async function healthCheck() {
  return request('/health')
}

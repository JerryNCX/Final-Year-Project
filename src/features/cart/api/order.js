import { request, getAccessToken } from '@/lib/client'

export async function createOrder(shippingAddress, buildSnapshot, total, shippingCost = 0, deliveryMethod = 'Express') {
  const token = await getAccessToken()
  return request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipping_address: shippingAddress, build_snapshot: buildSnapshot, total, shipping_cost: shippingCost, delivery_method: deliveryMethod }),
    token,
  })
}

export async function listOrders() {
  const token = await getAccessToken()
  return request('/api/orders', { token })
}

export async function getOrder(orderId) {
  const token = await getAccessToken()
  return request(`/api/orders/${orderId}`, { token })
}

export async function confirmPayment(orderId) {
  const token = await getAccessToken()
  return request(`/api/orders/${orderId}/confirm-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    token,
  })
}

export async function cancelOrder(orderId) {
  const token = await getAccessToken()
  return request(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    token,
  })
}

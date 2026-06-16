import { request, getAccessToken } from '@/lib/client'

export async function syncUserProfile(email) {
  const token = await getAccessToken()
  return request('/api/users/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    token,
  })
}

export async function getUserProfile() {
  const token = await getAccessToken()
  return request('/api/users/profile', { token })
}

export async function updateUserProfile(data) {
  const token = await getAccessToken()
  return request('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    token,
  })
}

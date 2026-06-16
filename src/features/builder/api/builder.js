import { request, getAccessToken } from '@/lib/client'

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

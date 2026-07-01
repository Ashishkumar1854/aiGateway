const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('aigw_client_token')
}

async function apiFetch(endpoint, options = {}) {
  const { auth = true, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  let data
  try {
    data = await res.json()
  } catch (err) {
    // response might not be json
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aigw_client_token')
      localStorage.removeItem('aigw_client_refresh')
      localStorage.removeItem('aigw_client_user')
      window.location.href = '/login'
    }
  }

  if (!res.ok) {
    throw new Error(data?.error?.message || 'API Error')
  }

  return data
}

export const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
}

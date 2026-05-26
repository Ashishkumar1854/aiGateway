export const AUTH_TOKEN_KEY = 'aigw_token'
export const AUTH_REFRESH_KEY = 'aigw_refresh'
export const AUTH_USER_KEY = 'aigw_user'

export function saveAuth(accessToken: string, refreshToken: string, user: unknown) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
  localStorage.setItem(AUTH_REFRESH_KEY, refreshToken)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem(AUTH_USER_KEY)
  return u ? JSON.parse(u) : null
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_REFRESH_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}
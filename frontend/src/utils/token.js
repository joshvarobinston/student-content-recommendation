// utils/token.js
// Handles all JWT token operations in localStorage

// Save both tokens after login
export const saveTokens = (access, refresh) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

// Remove all tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('access_token')
}

// ✅ Decode JWT token to get user info
export const getTokenPayload = () => {
  const token = getAccessToken()
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// ✅ Check if token is expired
export const isTokenExpired = () => {
  const payload = getTokenPayload()
  if (!payload) return true
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}
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
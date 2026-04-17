export const saveTokens = (access, refresh) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const savePendingOtp = (payload) => {
  localStorage.setItem('pending_otp', JSON.stringify(payload))
}

export const getPendingOtp = () => {
  const value = localStorage.getItem('pending_otp')
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    localStorage.removeItem('pending_otp')
    return null
  }
}

export const clearPendingOtp = () => {
  localStorage.removeItem('pending_otp')
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const isLoggedIn = () => {
  return !!localStorage.getItem('access_token')
}

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

export const isTokenExpired = () => {
  const payload = getTokenPayload()
  if (!payload) return true
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

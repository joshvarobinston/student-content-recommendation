// context/AuthContext.jsx
// Global authentication state management

import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../api/accountApi'
import { isLoggedIn, clearTokens } from '../utils/token'

// Create auth context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user profile on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (isLoggedIn()) {
        try {
          const res = await getProfile()
          setUser(res.data)
        } catch (error) {
          // Token invalid or expired — clear and redirect
          clearTokens()
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // Logout function — clear tokens and reset user
  const logout = () => {
    clearTokens()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {/* Show nothing while loading user */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

export default AuthContext
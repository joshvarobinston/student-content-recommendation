// context/AuthContext.jsx
// Global authentication state management

import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../api/accountApi'
import { isLoggedIn, clearTokens } from '../utils/token'

const AuthContext = createContext()

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
          clearTokens()
          setUser(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  // Logout function
  const logout = () => {
    clearTokens()
    setUser(null)
    window.location.href = '/login'
  }

  // ✅ Refetch user profile (after update)
  const refetchUser = async () => {
    try {
      const res = await getProfile()
      setUser(res.data)
    } catch (error) {
      clearTokens()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      loading,
      refetchUser  // ✅ Added
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

export default AuthContext
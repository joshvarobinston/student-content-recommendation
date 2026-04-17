import { createContext, useContext, useEffect, useState } from 'react'

import { getProfile } from '../api/accountApi'
import { clearPendingOtp, clearTokens, isLoggedIn } from '../utils/token'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      if (isLoggedIn()) {
        try {
          const res = await getProfile()
          setUser(res.data)
        } catch {
          clearTokens()
          setUser(null)
        }
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  const logout = () => {
    clearTokens()
    clearPendingOtp()
    setUser(null)
    window.location.href = '/login'
  }

  const refetchUser = async () => {
    try {
      const res = await getProfile()
      setUser(res.data)
    } catch {
      clearTokens()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        refetchUser,
      }}
    >
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

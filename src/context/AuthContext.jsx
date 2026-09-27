import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('studyflow_token') || null)
  const [loading, setLoading] = useState(true)

  // Initialize and verify existing token on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('studyflow_token')
      const storedUser = localStorage.getItem('studyflow_user')

      if (storedToken) {
        try {
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
          const res = await authApi.getMe()
          if (res?.success && res.user) {
            setUser(res.user)
            localStorage.setItem('studyflow_user', JSON.stringify(res.user))
          }
        } catch (err) {
          console.warn('Session verification notice:', err.message)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password })
      if (res?.success && res.token) {
        setToken(res.token)
        setUser(res.user)
        localStorage.setItem('studyflow_token', res.token)
        localStorage.setItem('studyflow_user', JSON.stringify(res.user))
        return { success: true, user: res.user }
      }
      return { success: false, message: res?.message || 'Login failed' }
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' }
    }
  }

  // Register handler
  const register = async (userData) => {
    try {
      const res = await authApi.register(userData)
      if (res?.success && res.token) {
        setToken(res.token)
        setUser(res.user)
        localStorage.setItem('studyflow_token', res.token)
        localStorage.setItem('studyflow_user', JSON.stringify(res.user))
        return { success: true, user: res.user }
      }
      return { success: false, message: res?.message || 'Registration failed' }
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' }
    }
  }

  // Logout handler
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('studyflow_token')
    localStorage.removeItem('studyflow_user')
    window.location.hash = '#home'
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Authentication Context - React Context API for State Management
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// API base URL
const API_URL = 'http://localhost:9876/api'

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Error getting current user:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user, redirectTo } = response.data

      localStorage.setItem('token', token)
      setUser(user)
      return { success: true, user, redirectTo }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Role checking utilities
  const isAdmin = () => user?.role === 'admin'
  const isUser = () => user?.role === 'user'
  const hasRole = (role) => user?.role === role
  const isAuthenticated = () => !!user

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isUser,
    hasRole,
    isAuthenticated,
    api // Export api instance for other components
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

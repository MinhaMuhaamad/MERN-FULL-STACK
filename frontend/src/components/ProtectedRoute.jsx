// Enhanced Protected Route Components with Role-Based Access
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Basic Protected Route - Requires Authentication
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// Admin Only Route
export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// User Only Route (Regular Users, Not Admins)
export const UserRoute = ({ children }) => {
  const { user, loading, isUser } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!isUser()) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// Multi-Role Route - Accepts array of allowed roles
export const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// Public Route - Redirects authenticated users based on role
export const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }
  
  if (user) {
    // Redirect authenticated users to their appropriate dashboard
    return <Navigate to={isAdmin() ? '/admin' : '/dashboard'} replace />
  }
  
  return children
}

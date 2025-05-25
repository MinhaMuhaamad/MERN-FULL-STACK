// MERN Stack Frontend - Main App Component with Role-Based Authentication
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import AdminLayout from './components/AdminLayout'
import { ProtectedRoute, AdminRoute, UserRoute, PublicRoute } from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import Unauthorized from './pages/Unauthorized'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />

              {/* Auth Routes - Redirect if already logged in */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* User Routes */}
              <Route path="/dashboard" element={
                <UserRoute>
                  <Dashboard />
                </UserRoute>
              } />
              <Route path="/create-post" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              } />

              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

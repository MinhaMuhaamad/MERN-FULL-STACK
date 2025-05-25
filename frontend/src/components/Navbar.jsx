// Enhanced Navigation Component - Role-Based Navigation
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin, isUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MERN App
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/posts" className="nav-link">Posts</Link>

          {!user && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}

          {isUser() && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/create-post" className="nav-link">Create Post</Link>
            </>
          )}

          {isAdmin() && (
            <>
              <Link to="/admin" className="nav-link admin-link">
                <span className="admin-icon">👑</span>
                Admin Panel
              </Link>
              <Link to="/admin/users" className="nav-link">Manage Users</Link>
              <Link to="/admin/posts" className="nav-link">Manage Posts</Link>
            </>
          )}

          {user && (
            <>
              <div className="nav-user-info">
                <span className="nav-user">
                  Welcome, {user.username}!
                </span>
                <span className="nav-role">
                  ({user.role})
                </span>
              </div>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

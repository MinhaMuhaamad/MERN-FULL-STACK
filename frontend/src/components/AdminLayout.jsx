// Admin Layout Component with Sidebar Navigation
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UserManagement from '../pages/admin/UserManagement'
import PostManagement from '../pages/admin/PostManagement'
import AdminSettings from '../pages/admin/AdminSettings'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const sidebarItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: '📊',
      exact: true
    },
    {
      path: '/admin/users',
      label: 'User Management',
      icon: '👥'
    },
    {
      path: '/admin/posts',
      label: 'Post Management',
      icon: '📝'
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: '⚙️'
    }
  ]

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <span className="admin-username">{user.username}</span>
              <span className="admin-role">{user.role}</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            {sidebarItems.map((item) => (
              <li key={item.path} className="admin-nav-item">
                <Link
                  to={item.path}
                  className={`admin-nav-link ${
                    item.exact 
                      ? location.pathname === item.path ? 'active' : ''
                      : isActiveRoute(item.path) ? 'active' : ''
                  }`}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">
            <span className="admin-nav-icon">🏠</span>
            <span className="admin-nav-label">Back to Site</span>
          </Link>
          <button onClick={logout} className="admin-logout-btn">
            <span className="admin-nav-icon">🚪</span>
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-page-title">
              {sidebarItems.find(item => 
                item.exact 
                  ? location.pathname === item.path
                  : isActiveRoute(item.path)
              )?.label || 'Admin Panel'}
            </h1>
            <div className="admin-header-actions">
              <span className="admin-welcome">
                Welcome back, {user.username}!
              </span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/posts" element={<PostManagement />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

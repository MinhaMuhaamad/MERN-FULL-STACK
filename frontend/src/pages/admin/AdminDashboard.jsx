// Admin Dashboard - Overview and Statistics
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { api } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  const { statistics, recentUsers, recentPosts } = dashboardData || {}

  return (
    <div className="admin-dashboard">
      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <span className="stat-number">{statistics?.totalUsers || 0}</span>
            <small className="stat-change">
              +{statistics?.newUsersThisWeek || 0} this week
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3>Admins</h3>
            <span className="stat-number">{statistics?.totalAdmins || 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Posts</h3>
            <span className="stat-number">{statistics?.totalPosts || 0}</span>
            <small className="stat-change">
              +{statistics?.newPostsThisWeek || 0} this week
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Published</h3>
            <span className="stat-number">{statistics?.publishedPosts || 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Drafts</h3>
            <span className="stat-number">{statistics?.draftPosts || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-recent-activity">
        <div className="admin-recent-section">
          <h3>Recent Users</h3>
          <div className="admin-recent-list">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <div key={user._id} className="admin-recent-item">
                  <div className="recent-item-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="recent-item-content">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <small>
                      Role: {user.role} | 
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className={`recent-item-status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent users</p>
            )}
          </div>
        </div>

        <div className="admin-recent-section">
          <h3>Recent Posts</h3>
          <div className="admin-recent-list">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map(post => (
                <div key={post._id} className="admin-recent-item">
                  <div className="recent-item-content">
                    <h4>{post.title}</h4>
                    <p>{post.content.substring(0, 100)}...</p>
                    <small>
                      By: {post.author?.username || 'Unknown'} | 
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className={`recent-item-status ${post.status}`}>
                    {post.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent posts</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => window.location.href = '/admin/users'}>
            <span className="action-icon">👥</span>
            <span>Manage Users</span>
          </button>
          <button className="quick-action-btn" onClick={() => window.location.href = '/admin/posts'}>
            <span className="action-icon">📝</span>
            <span>Manage Posts</span>
          </button>
          <button className="quick-action-btn" onClick={fetchDashboardData}>
            <span className="action-icon">🔄</span>
            <span>Refresh Data</span>
          </button>
          <button className="quick-action-btn" onClick={() => window.location.href = '/admin/settings'}>
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

// User Management - Admin can manage all users
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const UserManagement = () => {
  const { api, user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(filters).toString()
      const response = await api.get(`/admin/users?${queryParams}`)
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await api.put(`/admin/users/${userId}/role`, { role: newRole })
        fetchUsers() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to update user role')
      }
    }
  }

  const handleStatusChange = async (userId, isActive) => {
    const action = isActive ? 'activate' : 'deactivate'
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.put(`/admin/users/${userId}/status`, { isActive })
        fetchUsers() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || `Failed to ${action} user`)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user? This action will disable their account.')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        fetchUsers() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user')
      }
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  if (loading && users.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="user-management">
      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="filter-select"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn btn-primary">Retry</button>
        </div>
      )}

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{user.username}</div>
                      {user._id === currentUser.id && (
                        <small className="current-user-badge">You</small>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={user._id === currentUser.id}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {user._id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => handleStatusChange(user._id, !user.isActive)}
                          className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="admin-pagination">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.current} of {pagination.pages} 
            ({pagination.total} total users)
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default UserManagement

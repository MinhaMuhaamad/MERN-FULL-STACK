// Post Management - Admin can manage all posts
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const PostManagement = () => {
  const { api } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  })

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(filters).toString()
      const response = await api.get(`/admin/posts?${queryParams}`)
      setPosts(response.data.posts)
      setPagination(response.data.pagination)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (postId, newStatus) => {
    if (window.confirm(`Are you sure you want to change this post status to ${newStatus}?`)) {
      try {
        await api.put(`/admin/posts/${postId}/status`, { status: newStatus })
        fetchPosts() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to update post status')
      }
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/posts/${postId}`)
        fetchPosts() // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete post')
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

  if (loading && posts.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="post-management">
      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
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
          <button onClick={fetchPosts} className="btn btn-primary">Retry</button>
        </div>
      )}

      {/* Posts Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Likes</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td>
                  <div className="post-info">
                    <div className="post-title">{post.title}</div>
                    <div className="post-excerpt">
                      {post.content.substring(0, 100)}...
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="author-info">
                    <div className="author-name">
                      {post.author?.username || 'Unknown'}
                    </div>
                    <div className="author-email">
                      {post.author?.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td>
                  <span className="likes-count">
                    ❤️ {post.likes?.length || 0}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
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
            ({pagination.total} total posts)
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

      {/* Summary Stats */}
      <div className="post-stats">
        <div className="stat-item">
          <span className="stat-label">Total Posts:</span>
          <span className="stat-value">{pagination.total || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Showing:</span>
          <span className="stat-value">
            {posts.length} of {pagination.total || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostManagement

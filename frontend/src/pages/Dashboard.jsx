// Dashboard Component - Protected Route with User Data
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, api } = useAuth()
  const [userPosts, setUserPosts] = useState([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch user's posts
      const postsResponse = await api.get('/posts')
      const allPosts = postsResponse.data.posts || []
      
      // Filter posts by current user
      const myPosts = allPosts.filter(post => post.author._id === user.id)
      setUserPosts(myPosts)

      // Calculate stats
      const published = myPosts.filter(post => post.status === 'published').length
      const draft = myPosts.filter(post => post.status === 'draft').length
      
      setStats({
        totalPosts: myPosts.length,
        publishedPosts: published,
        draftPosts: draft
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`)
        setUserPosts(userPosts.filter(post => post._id !== postId))
        // Update stats
        fetchUserData()
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post')
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard, {user.username}!</h1>
        <p>Manage your posts and view your statistics</p>
      </div>

      {/* User Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <span className="stat-number">{stats.totalPosts}</span>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <span className="stat-number">{stats.publishedPosts}</span>
        </div>
        <div className="stat-card">
          <h3>Drafts</h3>
          <span className="stat-number">{stats.draftPosts}</span>
        </div>
      </div>

      {/* User Profile Info */}
      <div className="profile-section">
        <h2>Profile Information</h2>
        <div className="profile-card">
          <div className="profile-item">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="profile-item">
            <strong>Role:</strong> {user.role}
          </div>
          <div className="profile-item">
            <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="posts-section">
        <h2>Your Posts</h2>
        {userPosts.length === 0 ? (
          <div className="no-posts">
            <p>You haven't created any posts yet.</p>
            <a href="/create-post" className="btn btn-primary">
              Create Your First Post
            </a>
          </div>
        ) : (
          <div className="posts-list">
            {userPosts.map(post => (
              <div key={post._id} className="post-item">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className={`status ${post.status}`}>
                    {post.status}
                  </span>
                </div>
                <p className="post-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>Likes: {post.likes?.length || 0}</span>
                </div>
                <div className="post-actions">
                  <button className="btn btn-sm btn-secondary">
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deletePost(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

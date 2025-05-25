// Posts Component - CRUD Operations & API Integration
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])

  const { api, user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    // Filter posts based on search term
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPosts(filtered)
  }, [posts, searchTerm])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      setError('Failed to fetch posts')
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const likePost = async (postId) => {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    try {
      await api.post(`/posts/${postId}/like`)
      // Refresh posts to get updated like count
      fetchPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading posts...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1>All Posts</h1>
        <p>Discover and interact with posts from our community</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <article key={post._id} className="post-card">
                <header className="post-card-header">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span className="author">
                      By {post.author?.username || 'Unknown'}
                    </span>
                    <span className="date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </header>

                <div className="post-content">
                  <p>{post.content.substring(0, 200)}...</p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <footer className="post-card-footer">
                  <div className="post-stats">
                    <span className="likes">
                      ❤️ {post.likes?.length || 0} likes
                    </span>
                    <span className="comments">
                      💬 {post.comments?.length || 0} comments
                    </span>
                  </div>

                  <div className="post-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => likePost(post._id)}
                      disabled={!user}
                    >
                      {user ? 'Like' : 'Login to Like'}
                    </button>
                    <button className="btn btn-sm btn-outline">
                      Read More
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts

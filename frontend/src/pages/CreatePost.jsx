// Create Post Component - Form Handling & API Integration
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { api } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      setLoading(false)
      return
    }

    try {
      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags,
        status: formData.status
      }

      await api.post('/posts', postData)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <h1>Create New Post</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              maxLength="100"
              required
            />
            <small className="form-help">
              {formData.title.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows="10"
              maxLength="1000"
              required
            />
            <small className="form-help">
              {formData.content.length}/1000 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
            />
            <small className="form-help">
              Separate multiple tags with commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <small className="form-help">
              Drafts are only visible to you, published posts are public
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        {(formData.title || formData.content) && (
          <div className="post-preview">
            <h2>Preview</h2>
            <div className="preview-card">
              <h3>{formData.title || 'Untitled Post'}</h3>
              <p>{formData.content || 'No content yet...'}</p>
              {formData.tags && (
                <div className="preview-tags">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span key={index} className="tag">
                        #{tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
              <div className="preview-meta">
                <span>Status: {formData.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePost

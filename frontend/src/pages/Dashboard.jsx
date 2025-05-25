// Enhanced Dashboard Component - Profile/Settings Toggle with useState
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ThemeTest from '../components/ThemeTest';
const Dashboard = () => {
  const { user, api, isAdmin } = useAuth()
  // Existing state
  const [userPosts, setUserPosts] = useState([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  })
  const [loading, setLoading] = useState(true)
  // NEW: Toggle state for Profile/Settings view
  // useState Hook: [currentValue, functionToUpdateValue] = useState(initialValue)
  const [isProfileView, setIsProfileView] = useState(true) // true = Profile, false = Settings
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('dashboardTheme') || 'light';
  });

  // NEW: Profile data state (fetched from backend)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    joinedDate: '',
    lastLogin: ''
  })
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    fetchUserData()
    fetchProfileData() // NEW: Fetch profile data on component mount
  }, [])

  // Enhanced theme toggle with localStorage persistence
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('dashboardTheme', newTheme);
    console.log('Theme toggled to:', newTheme);
  }
  // NEW: Toggle function to switch between Profile and Settings view
  // This function uses setIsProfileView to update the state
  const toggleView = () => {
    setIsProfileView(!isProfileView) // Flip the boolean value
    // !isProfileView means: if currently true, make it false; if false, make it true
  }
  // NEW: Function to fetch detailed profile data from backend
  const fetchProfileData = async () => {
    try {
      setProfileLoading(true)

      // Mock API call (you can replace this with real API)
      // const response = await api.get(`/users/${user.id}/profile`)

      // MOCK DATA - Simulating backend response
      const mockProfileData = {
        firstName: user.profile?.firstName || 'John',
        lastName: user.profile?.lastName || 'Doe',
        bio: user.profile?.bio || 'Welcome to my profile! I love coding and learning new technologies.',
        avatar: user.profile?.avatar || '',
        joinedDate: user.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        location: 'New York, USA',
        website: 'https://johndoe.dev',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
      }

      setProfileData(mockProfileData)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setProfileLoading(false)
    }
  }

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
    return (
      <div className={`loading ${theme}-theme`}>
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }
  return (
    <div className={`dashboard ${theme}-theme`}>
      <ThemeTest />

      {/* Dashboard Header with Theme Controls */}
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard, {user.username}!</h1>
        <p>Manage your posts and view your statistics</p>

        {/* Enhanced Theme Toggle Controls */}
        <div className="theme-toggle">
          <button
            onClick={toggleTheme}
            className={`btn theme-btn ${theme === 'dark' ? 'btn-secondary' : 'btn-primary'}`}
          >
            {theme === 'light' ? '🌙 Switch to Dark Theme' : '☀️ Switch to Light Theme'}
          </button>
          <p className="current-theme">Current theme: {theme}</p>
        </div>

        {/* View Toggle Controls */}
        <div className="view-toggle">
          <button
            onClick={toggleView}
            className={`btn toggle-btn ${isProfileView ? 'active' : ''}`}
          >
            👤 Profile
          </button>
          <button
            onClick={toggleView}
            className={`btn toggle-btn ${!isProfileView ? 'active' : ''}`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* NEW: Conditional Rendering based on isProfileView state */}
      {/* This is the core of useState functionality - showing different content based on state */}
      {isProfileView ? (
        // PROFILE VIEW - Shows when isProfileView = true
        <div className="profile-view">
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

          {/* Enhanced Profile Information */}
          <div className="profile-details">
            <h2>Profile Details</h2>
            {profileLoading ? (
              <div className="loading">Loading profile...</div>
            ) : (
              <div className="profile-content">
                <div className="profile-card">
                  <div className="profile-avatar">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h3>{profileData.firstName} {profileData.lastName}</h3>
                    <p className="profile-username">@{user.username}</p>
                    <p className="profile-email">{user.email}</p>
                    <p className="profile-role">Role: {user.role}</p>
                  </div>
                </div>

                <div className="profile-bio">
                  <h4>About</h4>
                  <p>{profileData.bio}</p>
                </div>

                <div className="profile-stats">
                  <div className="stat-item">
                    <strong>Joined:</strong> {new Date(profileData.joinedDate).toLocaleDateString()}
                  </div>
                  <div className="stat-item">
                    <strong>Last Login:</strong> {new Date(profileData.lastLogin).toLocaleDateString()}
                  </div>
                  <div className="stat-item">
                    <strong>Location:</strong> {profileData.location}
                  </div>
                  <div className="stat-item">
                    <strong>Website:</strong>
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                      {profileData.website}
                    </a>
                  </div>
                </div>

                <div className="profile-skills">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {profileData.skills?.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // SETTINGS VIEW - Shows when isProfileView = false
        <div className="settings-view">
          <h2>Settings</h2>

          {/* General Settings */}
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Email Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>Dark Mode</label>
                <input type="checkbox" />
              </div>
              <div className="setting-item">
                <label>Public Profile</label>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="settings-section">
            <h3>Account Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user.username} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={user.email} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea defaultValue={profileData.bio} rows="3"></textarea>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Admin-specific settings - Only show if user is admin */}
          {isAdmin && (
            <div className="settings-section admin-settings">
              <h3>🔒 Admin Settings</h3>
              <div className="admin-controls">
                <div className="setting-item">
                  <label>System Maintenance Mode</label>
                  <input type="checkbox" />
                </div>
                <div className="setting-item">
                  <label>User Registration</label>
                  <select>
                    <option>Open</option>
                    <option>Invite Only</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Content Moderation</label>
                  <select>
                    <option>Automatic</option>
                    <option>Manual Review</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <button className="btn btn-warning">Save Admin Settings</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Posts - Always visible regardless of toggle state */}
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










// Admin Settings - System configuration and admin profile
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminSettings = () => {
  const { user, api } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [profileData, setProfileData] = useState({
    username: user.username,
    email: user.email,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    bio: user.profile?.bio || ''
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await api.put(`/users/${user.id}`, {
        username: profileData.username,
        email: profileData.email,
        profile: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          bio: profileData.bio
        }
      })
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'system', label: 'System Info', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ]

  return (
    <div className="admin-settings">
      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h3>Profile Settings</h3>
            <p>Update your admin profile information</p>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={profileData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* System Info Tab */}
        {activeTab === 'system' && (
          <div className="settings-section">
            <h3>System Information</h3>
            <p>Application and server details</p>

            <div className="system-info-grid">
              <div className="info-card">
                <h4>Application</h4>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">MERN Exam Practice</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Version:</span>
                  <span className="info-value">1.0.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Environment:</span>
                  <span className="info-value">Development</span>
                </div>
              </div>

              <div className="info-card">
                <h4>Database</h4>
                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">MongoDB Atlas</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-connected">Connected</span>
                </div>
              </div>

              <div className="info-card">
                <h4>Admin Account</h4>
                <div className="info-item">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{user.role}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Created:</span>
                  <span className="info-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <p>Manage your account security</p>

            <div className="security-options">
              <div className="security-card">
                <h4>Password</h4>
                <p>Change your admin password</p>
                <button className="btn btn-secondary">Change Password</button>
              </div>

              <div className="security-card">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>

              <div className="security-card">
                <h4>Login Sessions</h4>
                <p>View and manage your active login sessions</p>
                <button className="btn btn-secondary">View Sessions</button>
              </div>

              <div className="security-card">
                <h4>API Access</h4>
                <p>Manage API keys and access tokens</p>
                <button className="btn btn-secondary">Manage API Keys</button>
              </div>
            </div>

            <div className="security-info">
              <h4>Security Tips</h4>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication</li>
                <li>Regularly review login sessions</li>
                <li>Keep your browser updated</li>
                <li>Log out from shared computers</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSettings

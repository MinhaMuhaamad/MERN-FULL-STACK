// Unauthorized Access Page
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Unauthorized = () => {
  const { user, isAdmin, isUser } = useAuth()

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          🚫
        </div>
        
        <h1>Access Denied</h1>
        
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>

        {user && (
          <div className="user-info">
            <p>
              <strong>Current User:</strong> {user.username}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}

        <div className="unauthorized-actions">
          {user ? (
            <>
              <Link 
                to={isAdmin() ? '/admin' : '/dashboard'} 
                className="btn btn-primary"
              >
                Go to {isAdmin() ? 'Admin Dashboard' : 'Dashboard'}
              </Link>
              <Link to="/" className="btn btn-secondary">
                Go to Home
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/" className="btn btn-secondary">
                Go to Home
              </Link>
            </>
          )}
        </div>

        <div className="help-text">
          <h3>Need Help?</h3>
          <p>
            If you believe you should have access to this page, please contact an administrator.
          </p>
          
          {user && (
            <div className="role-info">
              <h4>Role Permissions:</h4>
              <ul>
                <li>
                  <strong>Users:</strong> Can access dashboard, create posts, manage own content
                </li>
                <li>
                  <strong>Admins:</strong> Can access admin panel, manage all users and posts
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Unauthorized

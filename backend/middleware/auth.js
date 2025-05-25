// Enhanced Authentication & Authorization Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required',
      userRole: req.user.role
    });
  }
  next();
};

// Check if user is regular user (not admin)
const requireUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
};

// Check if user owns the resource or is admin
const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;

  if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
};

// Check for specific roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        userRole: req.user.role
      });
    }
    next();
  };
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwnershipOrAdmin,
  requireRole,
  optionalAuth
};
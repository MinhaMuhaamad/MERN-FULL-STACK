// User Model - MongoDB Schema with Mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin','moderator'],
    default: 'user'
  },
  permissions: {
    type: [String], // Array of permissions for role-based access control
    default: [], // Default empty for non-admins
    enum: [
      'manage_users', // Can create/delete/update users
      'manage_content', // Can approve/delete content
      'view_reports', // Can view analytics or reports
      'manage_settings' // Can modify system settings
    ]
  },
  adminNotes: { // Optional admin-specific field
    type: String,
    default: '',
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  lastLogin: { // Optional admin-specific field
    type: Date
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.adminNotes;
  return user;
};

module.exports = mongoose.model('User', userSchema);

// MERN Stack Backend - Express Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
console.log('🔄 Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI loaded' : 'URI not found');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // Create default admin user if it doesn't exist
    try {
      const { createDefaultAdmin } = require('./utils/createAdmin');
      await createDefaultAdmin();
    } catch (error) {
      console.log('⚠️  Admin creation skipped:', error.message);
    }
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes - Load them after server starts
console.log('🔄 Loading routes...');
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/admin', require('./routes/admin'));
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Stack Backend API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 9876;
console.log('🔄 Starting server...');
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/`);
});

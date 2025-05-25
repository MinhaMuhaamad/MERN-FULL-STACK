// Simple server test
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('🔄 Starting server...');

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'MERN Stack Backend API - Server Running!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

// Start server first
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}`);
});

// Then try MongoDB connection
console.log('🔄 Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Server will continue running without database');
  });

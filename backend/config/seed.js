const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path to your User model
const bcrypt = require('bcryptjs');

async function seedAdminUser() {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const adminData = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!', // This will be hashed by the schema's pre-save hook
        role: 'admin',
        permissions: ['manage_users', 'manage_content', 'view_reports', 'manage_settings'],
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'System Administrator',
          avatar: ''
        },
        isActive: true,
        adminNotes: 'Default admin account created on initialization'
      };

      await User.create(adminData);
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

module.exports = seedAdminUser;
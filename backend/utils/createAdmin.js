// Admin User Creation Utility
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists:', adminExists.email);
      return adminExists;
    }

    // Create default admin
    const adminData = {
      username: 'admin',
      email: 'admin@mernexam.com',
      password: 'admin123456', // Will be hashed automatically
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        bio: 'Default system administrator account'
      },
      isActive: true
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Please change the password after first login!');
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

// Create admin with custom credentials
const createCustomAdmin = async (username, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const adminData = {
      username,
      email,
      password, // Will be hashed automatically
      role: 'admin',
      isActive: true
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Custom admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating custom admin:', error.message);
    throw error;
  }
};

// Promote existing user to admin
const promoteUserToAdmin = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    console.log('✅ User promoted to admin successfully!');
    console.log('👤 Username:', user.username);
    console.log('📧 Email:', user.email);
    
    return user;
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error.message);
    throw error;
  }
};

// CLI interface for creating admin
const runAdminCreation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔄 Connected to MongoDB');

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'default':
        await createDefaultAdmin();
        break;
      
      case 'custom':
        const [, username, email, password] = args;
        if (!username || !email || !password) {
          console.log('Usage: node createAdmin.js custom <username> <email> <password>');
          process.exit(1);
        }
        await createCustomAdmin(username, email, password);
        break;
      
      case 'promote':
        const [, userId] = args;
        if (!userId) {
          console.log('Usage: node createAdmin.js promote <userId>');
          process.exit(1);
        }
        await promoteUserToAdmin(userId);
        break;
      
      default:
        console.log('Available commands:');
        console.log('  default                           - Create default admin (admin@mernexam.com)');
        console.log('  custom <username> <email> <pass>  - Create custom admin');
        console.log('  promote <userId>                  - Promote existing user to admin');
        break;
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Export functions for use in other files
module.exports = {
  createDefaultAdmin,
  createCustomAdmin,
  promoteUserToAdmin
};

// Run CLI if this file is executed directly
if (require.main === module) {
  runAdminCreation();
}

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-testing-test';

async function setupTestDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to test database');
    
    // Optionally seed test data here
    
    console.log('Test database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

setupTestDatabase();


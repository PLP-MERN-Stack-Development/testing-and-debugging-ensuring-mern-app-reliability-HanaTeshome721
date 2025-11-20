// Test setup file for server-side tests
// This file runs before all tests

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRE = '1h';

// Increase timeout for async operations
jest.setTimeout(10000);


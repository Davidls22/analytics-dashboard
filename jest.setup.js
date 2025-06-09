// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Set test environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/analytics-test';
process.env.JWT_SECRET = 'test-secret';

// Increase timeout for tests
jest.setTimeout(10000); 
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/analytics-test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.API_KEY = 'test-api-key';

// Increase timeout for tests
jest.setTimeout(10000); 
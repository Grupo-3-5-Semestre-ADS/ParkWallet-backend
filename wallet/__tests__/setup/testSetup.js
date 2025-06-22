import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.API_GATEWAY_URL = 'http://localhost:8080';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'test_wallet_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_password';
process.env.JWT_SECRET = 'test_jwt_secret';

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Mock console to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();
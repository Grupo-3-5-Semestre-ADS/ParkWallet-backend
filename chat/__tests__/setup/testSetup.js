import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'test_chat_db';
process.env.DB_USER = 'test';
process.env.DB_PASS = 'test';
process.env.GATEWAY_HOST = 'localhost';
process.env.GATEWAY_PORT = '3000';

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Restore all mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();
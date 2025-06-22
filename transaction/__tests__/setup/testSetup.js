import { jest } from '@jest/globals';

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.API_GATEWAY_URL = 'http://localhost:3000';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_pass';
process.env.JWT_SECRET = 'test_jwt_secret';

// Configurações globais do Jest
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock do fetch global
global.fetch = jest.fn();
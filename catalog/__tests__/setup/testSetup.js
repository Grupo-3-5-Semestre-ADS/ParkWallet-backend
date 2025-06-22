import { jest } from '@jest/globals';

// Configuração global para testes
beforeAll(() => {
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.JWT_EXPIRATION_TIME = '1h';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '3306';
  process.env.DB_NAME = 'parkwallet_catalog_test';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASS = 'test_password';
});

beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Restaurar mocks após cada teste
  jest.restoreAllMocks();
});

afterAll(() => {
  // Limpeza final
  delete process.env.NODE_ENV;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_EXPIRATION_TIME;
});

// Mock global para console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global para DataTypes do Sequelize
global.DataTypes = {
  STRING: 'STRING',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  DATEONLY: 'DATEONLY',
  DECIMAL: 'DECIMAL',
  TEXT: 'TEXT',
  UUID: 'UUID',
  UUIDV4: 'UUIDV4'
};
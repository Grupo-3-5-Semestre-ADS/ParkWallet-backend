import { jest } from '@jest/globals';
import { beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

// Configurações globais para testes
beforeAll(() => {
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3005';
  process.env.API_GATEWAY_URL = 'http://localhost:3000';
});

beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Limpar timers e outros recursos após cada teste
  jest.clearAllTimers();
});

afterAll(() => {
  // Limpar variáveis de ambiente após todos os testes
  delete process.env.NODE_ENV;
  delete process.env.PORT;
  delete process.env.API_GATEWAY_URL;
});

// Mock global do console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};
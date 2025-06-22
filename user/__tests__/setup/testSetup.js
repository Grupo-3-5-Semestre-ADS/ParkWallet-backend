// Configuração de teste

// Configuração global para testes
beforeAll(() => {
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.JWT_EXPIRATION_TIME = '1h';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '3306';
  process.env.DB_NAME = 'parkwallet_test';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASS = 'test_password';
  process.env.RABBITMQ_URL = 'amqp://localhost:5672';
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
  TEXT: 'TEXT',
  ENUM: jest.fn().mockReturnValue('ENUM'),
  UUID: 'UUID',
  UUIDV4: 'UUIDV4'
};

// Helper para criar mock de resposta Express
export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  
  // Métodos customizados da aplicação
  res.okResponse = jest.fn().mockReturnValue(res);
  res.createdResponse = jest.fn().mockReturnValue(res);
  res.notFoundResponse = jest.fn().mockReturnValue(res);
  res.unauthorized = jest.fn().mockReturnValue(res);
  res.badRequest = jest.fn().mockReturnValue(res);
  res.hateoas_item = jest.fn().mockReturnValue(res);
  res.hateoas_list = jest.fn().mockReturnValue(res);
  
  return res;
};

// Helper para criar mock de request Express
export const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    payload: null,
    ...overrides
  };
};

// Helper para criar mock de next function
export const createMockNext = () => jest.fn();

// Mock para o modelo User
export const createMockUser = () => {
  const mockUser = {
    // Métodos estáticos
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    scope: jest.fn(),
    
    // Métodos de instância
    prototype: {
      comparePassword: jest.fn(),
      hasRole: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      reload: jest.fn(),
      save: jest.fn()
    }
  };
  
  // Mock para scope que retorna o próprio objeto com métodos
  mockUser.scope.mockReturnValue(mockUser);
  
  return mockUser;
};

// Mock para instância de usuário
export const createMockUserInstance = (data = {}) => {
  const defaultData = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'CUSTOMER',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const userData = { ...defaultData, ...data };
  
  return {
    ...userData,
    comparePassword: jest.fn(),
    hasRole: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    reload: jest.fn(),
    save: jest.fn(),
    changed: jest.fn(),
    toJSON: jest.fn().mockReturnValue(userData)
  };
};

// Mock para erros do Sequelize
export const createSequelizeValidationError = (errors = []) => {
  const error = new Error('Validation error');
  error.name = 'SequelizeValidationError';
  error.errors = errors.map(err => ({
    path: err.field,
    message: err.message,
    type: 'Validation error',
    value: err.value || null
  }));
  return error;
};

export const createSequelizeUniqueConstraintError = (errors = []) => {
  const error = new Error('Unique constraint error');
  error.name = 'SequelizeUniqueConstraintError';
  error.errors = errors.map(err => ({
    path: err.field,
    message: err.message,
    type: 'unique violation',
    value: err.value || null
  }));
  return error;
};

// Mock para JWT
export const createMockJWT = () => {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn()
  };
};

// Mock para bcrypt
export const createMockBcrypt = () => {
  return {
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn()
  };
};
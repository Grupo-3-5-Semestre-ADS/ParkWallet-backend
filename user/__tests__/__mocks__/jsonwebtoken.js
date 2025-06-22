// Mock do jsonwebtoken

// Mock token padrão
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Mock payload padrão
const mockPayload = {
  id: 1,
  email: 'test@example.com',
  role: 'CUSTOMER',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
};

// Mock para JWT
const jwt = {
  // Método sign
  sign: jest.fn().mockImplementation((payload, secret, options) => {
    // Simular diferentes cenários baseados no payload
    if (payload && typeof payload === 'object') {
      return mockToken;
    }
    throw new Error('Invalid payload');
  }),
  
  // Método verify
  verify: jest.fn().mockImplementation((token, secret, options) => {
    // Simular diferentes cenários baseados no token
    if (token === mockToken) {
      return mockPayload;
    }
    
    if (token === 'invalid-token') {
      const error = new Error('invalid token');
      error.name = 'JsonWebTokenError';
      throw error;
    }
    
    if (token === 'expired-token') {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      error.expiredAt = new Date();
      throw error;
    }
    
    if (token === 'malformed-token') {
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';
      throw error;
    }
    
    // Token válido genérico
    return mockPayload;
  }),
  
  // Método decode
  decode: jest.fn().mockImplementation((token, options) => {
    if (token === mockToken) {
      return mockPayload;
    }
    
    if (token === 'invalid-token') {
      return null;
    }
    
    // Retornar payload genérico para outros tokens
    return {
      ...mockPayload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    };
  }),
  
  // Erros do JWT
  JsonWebTokenError: class JsonWebTokenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  },
  
  TokenExpiredError: class TokenExpiredError extends Error {
    constructor(message, expiredAt) {
      super(message);
      this.name = 'TokenExpiredError';
      this.expiredAt = expiredAt;
    }
  },
  
  NotBeforeError: class NotBeforeError extends Error {
    constructor(message, date) {
      super(message);
      this.name = 'NotBeforeError';
      this.date = date;
    }
  }
};

// Helpers para testes
jwt.__setMockToken = (token) => {
  mockToken = token;
};

jwt.__setMockPayload = (payload) => {
  Object.assign(mockPayload, payload);
};

jwt.__resetMocks = () => {
  jwt.sign.mockClear();
  jwt.verify.mockClear();
  jwt.decode.mockClear();
};

// Configurar comportamentos específicos para testes
jwt.__mockSignSuccess = (returnToken = mockToken) => {
  jwt.sign.mockReturnValue(returnToken);
};

jwt.__mockSignError = (error = new Error('Sign error')) => {
  jwt.sign.mockImplementation(() => {
    throw error;
  });
};

jwt.__mockVerifySuccess = (returnPayload = mockPayload) => {
  jwt.verify.mockReturnValue(returnPayload);
};

jwt.__mockVerifyError = (error = new jwt.JsonWebTokenError('Invalid token')) => {
  jwt.verify.mockImplementation(() => {
    throw error;
  });
};

jwt.__mockDecodeSuccess = (returnPayload = mockPayload) => {
  jwt.decode.mockReturnValue(returnPayload);
};

jwt.__mockDecodeNull = () => {
  jwt.decode.mockReturnValue(null);
};

export default jwt;

// Named exports para compatibilidade
export const {
  sign,
  verify,
  decode,
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError
} = jwt;
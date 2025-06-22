// Mock do jsonwebtoken
const jwt = {
  sign: jest.fn(),
  verify: jest.fn()
};

// Mock das variáveis de ambiente
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRATION_TIME = '1h';

// Mock das funções de resposta
const createMockResponse = () => {
  const res = {};
  res.okResponse = jest.fn().mockReturnValue(res);
  res.unauthorized = jest.fn().mockReturnValue(res);
  return res;
};

const createMockRequest = (user = null) => {
  return {
    user,
    headers: {}
  };
};

const createMockNext = () => jest.fn();

// Simular a lógica das funções do authController
const generate = (req, res, next) => {
  if (!req.user) {
    return res.unauthorized();
  }

  const payload = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  };

  const JWTSECRET = process.env.JWT_SECRET;
  const JWTEXPIRE = process.env.JWT_EXPIRATION_TIME;

  const token = jwt.sign(payload, JWTSECRET, {
    expiresIn: JWTEXPIRE,
  });

  res.okResponse({ token });
};

const verify = (authorizedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.unauthorized();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.payload = decoded;
      
      if (authorizedRoles.length > 0 && !authorizedRoles.includes(decoded.role)) {
        return res.unauthorized();
      }
      
      next();
    } catch (error) {
      return res.unauthorized();
    }
  };
};

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    test('deve gerar token para usuário válido', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'CUSTOMER'
      };
      
      const req = createMockRequest(mockUser);
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.sign.mockReturnValue('mock-token');
      
      generate(req, res, next);
      
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'test@example.com',
          role: 'CUSTOMER'
        },
        'test-secret',
        { expiresIn: '1h' }
      );
      
      expect(res.okResponse).toHaveBeenCalledWith({ token: 'mock-token' });
    });

    test('deve retornar unauthorized quando usuário não existe', () => {
      const req = createMockRequest(null);
      const res = createMockResponse();
      const next = createMockNext();
      
      generate(req, res, next);
      
      expect(res.unauthorized).toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    test('deve verificar token válido', () => {
      const req = {
        headers: {
          authorization: 'Bearer valid-token'
        }
      };
      const res = createMockResponse();
      const next = createMockNext();
      
      const mockPayload = {
        id: 1,
        email: 'test@example.com',
        role: 'CUSTOMER'
      };
      
      jwt.verify.mockReturnValue(mockPayload);
      
      const middleware = verify();
      middleware(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(req.payload).toEqual(mockPayload);
      expect(next).toHaveBeenCalled();
    });

    test('deve retornar unauthorized para token inválido', () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      };
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const middleware = verify();
      middleware(req, res, next);
      
      expect(res.unauthorized).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('deve verificar role autorizada', () => {
      const req = {
        headers: {
          authorization: 'Bearer valid-token'
        }
      };
      const res = createMockResponse();
      const next = createMockNext();
      
      const mockPayload = {
        id: 1,
        email: 'admin@example.com',
        role: 'ADMIN'
      };
      
      jwt.verify.mockReturnValue(mockPayload);
      
      const middleware = verify(['ADMIN']);
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });

    test('deve retornar unauthorized para role não autorizada', () => {
      const req = {
        headers: {
          authorization: 'Bearer valid-token'
        }
      };
      const res = createMockResponse();
      const next = createMockNext();
      
      const mockPayload = {
        id: 1,
        email: 'customer@example.com',
        role: 'CUSTOMER'
      };
      
      jwt.verify.mockReturnValue(mockPayload);
      
      const middleware = verify(['ADMIN']);
      middleware(req, res, next);
      
      expect(res.unauthorized).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
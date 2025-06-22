// Mock User model and createUser service before importing controller
jest.mock('../../src/models/userModel.js', () => ({
  default: {
    create: jest.fn()
  }
}));

// Import real controller functions
import { createUser } from '../../src/controllers/registerController.js';
import User from '../../src/models/userModel.js';

describe('RegisterController Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset User.create mock
    User.create = jest.fn();
    
    // Mock request object
    req = {
      body: {}
    };
    
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      created: jest.fn(),
      createdResponse: jest.fn()
    };
    
    // Mock next function
    next = jest.fn();
  });

  describe('createUser function', () => {
    it('deve criar usuário com sucesso', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        cpf: '12345678901',
        password: 'password123',
        birthdate: '1990-01-01'
      };
      
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        cpf: '12345678901',
        active: true,
        role: 'CUSTOMER'
      };
      
      User.create.mockResolvedValue(mockUser);
      res.createdResponse = jest.fn();

      // Act
      await createUser(req, res, next);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        cpf: '12345678901',
        password: 'password123',
        birthdate: '1990-01-01',
        active: true,
        role: 'CUSTOMER'
      });
      expect(res.createdResponse).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro de validação', async () => {
      // Arrange
      req.body = {
        name: '',
        email: 'invalid-email',
        cpf: '123'
      };
      
      const validationError = {
        name: 'SequelizeValidationError',
        errors: [
          { path: 'name', message: 'Name is required' },
          { path: 'email', message: 'Invalid email format' },
          { path: 'cpf', message: 'CPF must have 11 digits' }
        ]
      };
      
      User.create.mockRejectedValue(validationError);

      // Act
      await createUser(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Validation error",
        errors: [
          { field: 'name', message: 'Name is required' },
          { field: 'email', message: 'Invalid email format' },
          { field: 'cpf', message: 'CPF must have 11 digits' }
        ]
      });
    });

    it('deve retornar erro de constraint única (email duplicado)', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        cpf: '12345678901',
        password: 'password123'
      };
      
      const uniqueConstraintError = {
        name: 'SequelizeUniqueConstraintError',
        errors: [
          { path: 'email', message: 'Email already exists' }
        ]
      };
      
      User.create.mockRejectedValue(uniqueConstraintError);

      // Act
      await createUser(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Validation error",
        errors: [
          { field: 'email', message: 'Email already exists' }
        ]
      });
    });

    it('deve chamar next com erro quando ocorre exceção não tratada', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        cpf: '12345678901',
        password: 'password123'
      };
      
      const error = new Error('Database connection error');
      User.create.mockRejectedValue(error);

      // Act
      await createUser(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });


});
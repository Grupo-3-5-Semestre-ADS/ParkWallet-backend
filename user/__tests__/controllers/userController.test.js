// Mock User model before importing controller
jest.mock('../../src/models/userModel.js', () => ({
  default: {
    scope: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn()
  }
}));

// Mock Sequelize Op
jest.mock('sequelize', () => ({
  Op: {
    like: Symbol('like')
  }
}));

// Import real controller functions
import { login, showUser, listUsers, editUser } from '../../src/controllers/userController.js';
import User from '../../src/models/userModel.js';
import { Op } from 'sequelize';

describe('UserController Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset User model mocks
    User.scope = jest.fn();
    User.findOne = jest.fn();
    User.findByPk = jest.fn();
    User.findAndCountAll = jest.fn();
    User.update = jest.fn();
    
    // Mock request object
    req = {
      body: {},
      params: {},
      query: {},
      user: {}
    };
    
    // Mock response object
    res = {
      unauthorized: jest.fn(),
      notFoundResponse: jest.fn(),
      hateoas_item: jest.fn(),
      hateoas_list: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock next function
    next = jest.fn();
  });

  describe('login function', () => {
    it('deve fazer login com credenciais válidas', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      User.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser)
      });

      // Act
      await login(req, res, next);

      // Assert
      expect(User.scope).toHaveBeenCalledWith('withPassword');
      expect(req.user).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
      expect(next).toHaveBeenCalled();
      expect(res.unauthorized).not.toHaveBeenCalled();
    });

    it('deve retornar unauthorized quando usuário não existe', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      User.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null)
      });

      // Act
      await login(req, res, next);

      // Assert
      expect(res.unauthorized).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar unauthorized quando senha está incorreta', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      
      User.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser)
      });

      // Act
      await login(req, res, next);

      // Assert
      expect(res.unauthorized).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('showUser function', () => {
    it('deve retornar usuário quando encontrado', async () => {
      // Arrange
      req.params = { id: '1' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };
      
      User.findByPk.mockResolvedValue(mockUser);

      // Act
      await showUser(req, res, next);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith('1');
      expect(res.hateoas_item).toHaveBeenCalledWith(mockUser);
      expect(res.notFoundResponse).not.toHaveBeenCalled();
    });

    it('deve retornar not found quando usuário não existe', async () => {
      // Arrange
      req.params = { id: '999' };
      User.findByPk.mockResolvedValue(null);

      // Act
      await showUser(req, res, next);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith('999');
      expect(res.notFoundResponse).toHaveBeenCalled();
      expect(res.hateoas_item).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      // Arrange
      req.params = { id: '1' };
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      // Act
      await showUser(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listUsers function', () => {
    it('deve listar usuários com paginação padrão', async () => {
      // Arrange
      req.query = {};
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' }
      ];
      
      User.findAndCountAll.mockResolvedValue({
        rows: mockUsers,
        count: 2
      });

      // Act
      await listUsers(req, res, next);

      // Assert
      expect(User.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        offset: 0,
        limit: 10,
        order: [['id', 'ASC']]
      });
      expect(res.hateoas_list).toHaveBeenCalledWith(mockUsers, 1);
    });

    it('deve listar usuários com filtro de busca', async () => {
      // Arrange
      req.query = { search: 'John', _page: '1', _size: '5' };
      const mockUsers = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
      
      User.findAndCountAll.mockResolvedValue({
        rows: mockUsers,
        count: 1
      });

      // Act
      await listUsers(req, res, next);

      // Assert
      expect(User.findAndCountAll).toHaveBeenCalledWith({
        where: { name: { [Op.like]: '%John%' } },
        offset: 0,
        limit: 5,
        order: [['id', 'ASC']]
      });
      expect(res.hateoas_list).toHaveBeenCalledWith(mockUsers, 1);
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      // Arrange
      req.query = {};
      const error = new Error('Database error');
      User.findAndCountAll.mockRejectedValue(error);

      // Act
      await listUsers(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('editUser function', () => {
    it('deve editar usuário com sucesso', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        name: 'Updated Name',
        email: 'updated@example.com',
        cpf: '12345678901'
      };
      
      const mockUser = {
        id: 1,
        name: 'Old Name',
        email: 'old@example.com',
        cpf: '12345678901',
        active: true,
        update: jest.fn().mockResolvedValue()
      };
      
      User.findByPk.mockResolvedValue(mockUser);

      // Act
      await editUser(req, res, next);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith('1');
      expect(mockUser.update).toHaveBeenCalledWith({
        name: 'Updated Name',
        email: 'updated@example.com',
        cpf: '12345678901',
        birthdate: undefined,
        active: true
      });
      expect(res.hateoas_item).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar not found quando usuário não existe', async () => {
      // Arrange
      req.params = { id: '999' };
      req.body = { name: 'Updated Name' };
      User.findByPk.mockResolvedValue(null);

      // Act
      await editUser(req, res, next);

      // Assert
      expect(res.notFoundResponse).toHaveBeenCalled();
      expect(res.hateoas_item).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = { name: 'Updated Name' };
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      // Act
      await editUser(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });


});
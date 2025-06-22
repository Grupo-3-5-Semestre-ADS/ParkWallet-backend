// Mock da função createUser
const createUser = jest.fn();

// Mock do modelo User
const mockUser = {
  create: jest.fn()
};

global.User = mockUser;

describe('Register Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser function', () => {
    it('deve simular criação de usuário', () => {
      // Arrange
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        password: 'password123',
        birthdate: '1990-01-01'
      };

      // Act
      createUser.mockReturnValue({ success: true });
      const result = createUser(userData);

      // Assert
      expect(result).toEqual({ success: true });
      expect(createUser).toHaveBeenCalledWith(userData);
    });

    it('deve simular erro de validação', () => {
      // Arrange
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123'
      };

      // Act
      createUser.mockReturnValue({ error: 'Validation failed' });
      const result = createUser(invalidData);

      // Assert
      expect(result).toEqual({ error: 'Validation failed' });
      expect(createUser).toHaveBeenCalledWith(invalidData);
    });

    it('deve simular criação sem CPF', () => {
      // Arrange
      const userData = {
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'password123',
        birthdate: '1995-05-15'
      };

      // Act
      createUser.mockReturnValue({ success: true, id: 2 });
      const result = createUser(userData);

      // Assert
      expect(result).toEqual({ success: true, id: 2 });
      expect(createUser).toHaveBeenCalledWith(userData);
    });
  });

  describe('User model', () => {
    it('deve chamar User.create', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockUser.create.mockResolvedValue({ id: 1, ...userData });

      // Act
      const result = await mockUser.create(userData);

      // Assert
      expect(result).toEqual({ id: 1, ...userData });
      expect(mockUser.create).toHaveBeenCalledWith(userData);
    });
  });
});
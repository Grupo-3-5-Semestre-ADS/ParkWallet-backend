// Mock do bcryptjs

// Hash padrão para testes
const mockHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // hash de 'secret'
const mockSalt = '$2a$10$N9qo8uLOickgx2ZMRZoMye';

// Mock para bcryptjs
const bcrypt = {
  // Método genSalt
  genSalt: jest.fn().mockImplementation((rounds = 10) => {
    return Promise.resolve(mockSalt);
  }),
  
  // Método genSaltSync
  genSaltSync: jest.fn().mockImplementation((rounds = 10) => {
    return mockSalt;
  }),
  
  // Método hash
  hash: jest.fn().mockImplementation((data, saltOrRounds) => {
    // Simular diferentes cenários
    if (!data) {
      return Promise.reject(new Error('data required'));
    }
    
    if (data === 'error-password') {
      return Promise.reject(new Error('Hash error'));
    }
    
    // Retornar hash baseado na senha para testes consistentes
    const hashMap = {
      'password123': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'newpassword': '$2a$10$DifferentHashForNewPassword123456789012345678901234567890',
      'secret': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'admin123': '$2a$10$AdminHashForTestingPurposes123456789012345678901234567890',
      'customer123': '$2a$10$CustomerHashForTesting123456789012345678901234567890123'
    };
    
    return Promise.resolve(hashMap[data] || mockHash);
  }),
  
  // Método hashSync
  hashSync: jest.fn().mockImplementation((data, saltOrRounds) => {
    if (!data) {
      throw new Error('data required');
    }
    
    if (data === 'error-password') {
      throw new Error('Hash error');
    }
    
    const hashMap = {
      'password123': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'newpassword': '$2a$10$DifferentHashForNewPassword123456789012345678901234567890',
      'secret': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'admin123': '$2a$10$AdminHashForTestingPurposes123456789012345678901234567890',
      'customer123': '$2a$10$CustomerHashForTesting123456789012345678901234567890123'
    };
    
    return hashMap[data] || mockHash;
  }),
  
  // Método compare
  compare: jest.fn().mockImplementation((data, encrypted) => {
    // Simular diferentes cenários de comparação
    if (!data || !encrypted) {
      return Promise.resolve(false);
    }
    
    // Mapeamento de senhas e seus hashes correspondentes
    const validCombinations = {
      'password123': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'secret': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'admin123': '$2a$10$AdminHashForTestingPurposes123456789012345678901234567890',
      'customer123': '$2a$10$CustomerHashForTesting123456789012345678901234567890123',
      'newpassword': '$2a$10$DifferentHashForNewPassword123456789012345678901234567890'
    };
    
    // Verificar se a combinação é válida
    const isValid = validCombinations[data] === encrypted;
    
    return Promise.resolve(isValid);
  }),
  
  // Método compareSync
  compareSync: jest.fn().mockImplementation((data, encrypted) => {
    if (!data || !encrypted) {
      return false;
    }
    
    const validCombinations = {
      'password123': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'secret': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      'admin123': '$2a$10$AdminHashForTestingPurposes123456789012345678901234567890',
      'customer123': '$2a$10$CustomerHashForTesting123456789012345678901234567890123',
      'newpassword': '$2a$10$DifferentHashForNewPassword123456789012345678901234567890'
    };
    
    return validCombinations[data] === encrypted;
  }),
  
  // Método getRounds
  getRounds: jest.fn().mockImplementation((encrypted) => {
    // Extrair rounds do hash (formato $2a$rounds$...)
    if (typeof encrypted === 'string' && encrypted.startsWith('$2a$')) {
      const parts = encrypted.split('$');
      return parseInt(parts[2], 10) || 10;
    }
    return 10;
  }),
  
  // Método getSalt
  getSalt: jest.fn().mockImplementation((encrypted) => {
    if (typeof encrypted === 'string' && encrypted.startsWith('$2a$')) {
      const parts = encrypted.split('$');
      if (parts.length >= 4) {
        return `$${parts[1]}$${parts[2]}$${parts[3]}`;
      }
    }
    return mockSalt;
  })
};

// Helpers para testes
bcrypt.__setMockHash = (hash) => {
  mockHash = hash;
};

bcrypt.__setMockSalt = (salt) => {
  mockSalt = salt;
};

bcrypt.__resetMocks = () => {
  bcrypt.genSalt.mockClear();
  bcrypt.genSaltSync.mockClear();
  bcrypt.hash.mockClear();
  bcrypt.hashSync.mockClear();
  bcrypt.compare.mockClear();
  bcrypt.compareSync.mockClear();
  bcrypt.getRounds.mockClear();
  bcrypt.getSalt.mockClear();
};

// Configurar comportamentos específicos para testes
bcrypt.__mockHashSuccess = (returnHash = mockHash) => {
  bcrypt.hash.mockResolvedValue(returnHash);
  bcrypt.hashSync.mockReturnValue(returnHash);
};

bcrypt.__mockHashError = (error = new Error('Hash error')) => {
  bcrypt.hash.mockRejectedValue(error);
  bcrypt.hashSync.mockImplementation(() => {
    throw error;
  });
};

bcrypt.__mockCompareSuccess = (result = true) => {
  bcrypt.compare.mockResolvedValue(result);
  bcrypt.compareSync.mockReturnValue(result);
};

bcrypt.__mockCompareError = (error = new Error('Compare error')) => {
  bcrypt.compare.mockRejectedValue(error);
  bcrypt.compareSync.mockImplementation(() => {
    throw error;
  });
};

bcrypt.__mockGenSaltSuccess = (returnSalt = mockSalt) => {
  bcrypt.genSalt.mockResolvedValue(returnSalt);
  bcrypt.genSaltSync.mockReturnValue(returnSalt);
};

bcrypt.__mockGenSaltError = (error = new Error('GenSalt error')) => {
  bcrypt.genSalt.mockRejectedValue(error);
  bcrypt.genSaltSync.mockImplementation(() => {
    throw error;
  });
};

export default bcrypt;

// Named exports para compatibilidade
export const {
  genSalt,
  genSaltSync,
  hash,
  hashSync,
  compare,
  compareSync,
  getRounds,
  getSalt
} = bcrypt;
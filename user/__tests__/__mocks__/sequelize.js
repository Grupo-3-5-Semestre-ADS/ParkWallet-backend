// Mock do Sequelize

// Mock para DataTypes
export const DataTypes = {
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

// Mock para instância do modelo
const createMockModel = () => {
  const mockInstance = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'CUSTOMER',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Métodos de instância
    save: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
    reload: jest.fn().mockResolvedValue(true),
    changed: jest.fn().mockReturnValue(false),
    toJSON: jest.fn().mockReturnValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'CUSTOMER',
      active: true
    }),
    
    // Métodos customizados do modelo User
    comparePassword: jest.fn().mockResolvedValue(true),
    hasRole: jest.fn().mockReturnValue(true)
  };
  
  return mockInstance;
};

// Mock para o modelo
const createMockModelClass = () => {
  const mockModel = {
    // Métodos estáticos
    create: jest.fn().mockResolvedValue(createMockModel()),
    findOne: jest.fn().mockResolvedValue(createMockModel()),
    findByPk: jest.fn().mockResolvedValue(createMockModel()),
    findAll: jest.fn().mockResolvedValue([createMockModel()]),
    findAndCountAll: jest.fn().mockResolvedValue({
      count: 1,
      rows: [createMockModel()]
    }),
    update: jest.fn().mockResolvedValue([1]),
    destroy: jest.fn().mockResolvedValue(1),
    scope: jest.fn().mockReturnThis(),
    
    // Hooks
    beforeCreate: jest.fn(),
    beforeUpdate: jest.fn(),
    afterCreate: jest.fn(),
    
    // Associações
    associate: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn()
  };
  
  // Fazer scope retornar o próprio modelo
  mockModel.scope.mockReturnValue(mockModel);
  
  return mockModel;
};

// Mock para Sequelize
const mockSequelize = {
  // Métodos de conexão
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  close: jest.fn().mockResolvedValue(true),
  
  // Métodos de transação
  transaction: jest.fn().mockImplementation((callback) => {
    const mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    };
    
    if (callback) {
      return callback(mockTransaction);
    }
    
    return Promise.resolve(mockTransaction);
  }),
  
  // Métodos de query
  query: jest.fn().mockResolvedValue([]),
  
  // Definição de modelos
  define: jest.fn().mockImplementation((name, attributes, options) => {
    const model = createMockModelClass();
    model.name = name;
    model.attributes = attributes;
    model.options = options;
    return model;
  }),
  
  // Importação de modelos
  import: jest.fn().mockResolvedValue(createMockModelClass()),
  
  // DataTypes
  DataTypes,
  
  // Operadores
  Op: {
    eq: Symbol('eq'),
    ne: Symbol('ne'),
    gte: Symbol('gte'),
    gt: Symbol('gt'),
    lte: Symbol('lte'),
    lt: Symbol('lt'),
    not: Symbol('not'),
    is: Symbol('is'),
    in: Symbol('in'),
    notIn: Symbol('notIn'),
    like: Symbol('like'),
    notLike: Symbol('notLike'),
    iLike: Symbol('iLike'),
    notILike: Symbol('notILike'),
    regexp: Symbol('regexp'),
    notRegexp: Symbol('notRegexp'),
    iRegexp: Symbol('iRegexp'),
    notIRegexp: Symbol('notIRegexp'),
    between: Symbol('between'),
    notBetween: Symbol('notBetween'),
    overlap: Symbol('overlap'),
    contains: Symbol('contains'),
    contained: Symbol('contained'),
    adjacent: Symbol('adjacent'),
    strictLeft: Symbol('strictLeft'),
    strictRight: Symbol('strictRight'),
    noExtendRight: Symbol('noExtendRight'),
    noExtendLeft: Symbol('noExtendLeft'),
    and: Symbol('and'),
    or: Symbol('or'),
    any: Symbol('any'),
    all: Symbol('all'),
    values: Symbol('values'),
    col: Symbol('col'),
    placeholder: Symbol('placeholder'),
    join: Symbol('join'),
    startsWith: Symbol('startsWith'),
    endsWith: Symbol('endsWith'),
    substring: Symbol('substring')
  },
  
  // Validadores
  Validator: {
    isEmail: jest.fn().mockReturnValue(true),
    isLength: jest.fn().mockReturnValue(true),
    isDate: jest.fn().mockReturnValue(true),
    isNumeric: jest.fn().mockReturnValue(true)
  },
  
  // Erros
  ValidationError: class ValidationError extends Error {
    constructor(message, errors = []) {
      super(message);
      this.name = 'SequelizeValidationError';
      this.errors = errors;
    }
  },
  
  UniqueConstraintError: class UniqueConstraintError extends Error {
    constructor(message, errors = []) {
      super(message);
      this.name = 'SequelizeUniqueConstraintError';
      this.errors = errors;
    }
  },
  
  DatabaseError: class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'SequelizeDatabaseError';
    }
  },
  
  ConnectionError: class ConnectionError extends Error {
    constructor(message) {
      super(message);
      this.name = 'SequelizeConnectionError';
    }
  }
};

// Exportar como classe e instância
export default class Sequelize {
  constructor() {
    return mockSequelize;
  }
  
  static DataTypes = DataTypes;
}

// Exportar também como named export
export { mockSequelize as Sequelize };
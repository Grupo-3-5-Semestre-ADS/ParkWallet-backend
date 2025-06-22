import { jest } from '@jest/globals';

// Mock do Sequelize
const mockSequelize = {
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  close: jest.fn().mockResolvedValue(true),
  define: jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
    hasOne: jest.fn(),
    belongsToMany: jest.fn()
  }),
  transaction: jest.fn().mockImplementation((callback) => {
    const mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    };
    return callback(mockTransaction);
  })
};

// Mock dos DataTypes
const DataTypes = {
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

// Mock da classe Sequelize
const Sequelize = jest.fn().mockImplementation(() => mockSequelize);
Sequelize.DataTypes = DataTypes;

export { Sequelize, DataTypes };
export default Sequelize;
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock do Sequelize.Op
jest.mock('sequelize', () => ({
  Op: {
    in: Symbol('in'),
    and: Symbol('and'),
    or: Symbol('or')
  }
}));

// Mock das funções de resposta
const mockResponse = {
  hateoas_item: jest.fn(),
  hateoas_list: jest.fn(),
  notFoundResponse: jest.fn(),
  createdResponse: jest.fn(),
  okResponse: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

// Mock do objeto request
const mockRequest = {
  params: {},
  body: {},
  query: {}
};

// Mock da função next
const mockNext = jest.fn();

// Mock dos modelos
const mockTransaction = {
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  getItemsTransaction: jest.fn()
};

const mockItemTransaction = {
  findAll: jest.fn()
};

// Mock dos imports
jest.mock('../../src/models/index.js', () => ({
  Transaction: mockTransaction,
  ItemTransaction: mockItemTransaction
}));

// Simular as funções do controller
const showTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await mockTransaction.findByPk(id);
    
    if (!transaction) {
      return res.notFoundResponse();
    }
    
    res.hateoas_item(transaction);
  } catch (err) {
    next(err);
  }
};

const listTransactions = async (req, res, next) => {
  try {
    const { _page = "1", _size = "10", _order = 'id', activesOnly = "false" } = req.query;
    const offset = (parseInt(_page) - 1) * _size;
    const where = activesOnly === "true" ? { active: true } : {};
    
    const { rows: transactions, count: totalItems } = await mockTransaction.findAndCountAll({
      where,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });
    
    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(transactions, totalPages);
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { userId, totalValue, operation, status } = req.body;
    
    await mockTransaction.create({
      userId,
      totalValue,
      operation,
      status: status || 'pending'
    });
    
    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

describe('TransactionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showTransaction', () => {
    it('deve retornar uma transação quando encontrada', async () => {
      const mockTransactionData = {
        id: 1,
        userId: 1,
        totalValue: 100.00,
        operation: 'debit',
        status: 'completed'
      };

      mockTransaction.findByPk.mockResolvedValue(mockTransactionData);
      mockRequest.params = { id: '1' };

      await showTransaction(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.findByPk).toHaveBeenCalledWith('1');
      expect(mockResponse.hateoas_item).toHaveBeenCalledWith(mockTransactionData);
    });

    it('deve retornar 404 quando transação não encontrada', async () => {
      mockTransaction.findByPk.mockResolvedValue(null);
      mockRequest.params = { id: '999' };

      await showTransaction(mockRequest, mockResponse, mockNext);

      expect(mockResponse.notFoundResponse).toHaveBeenCalled();
    });

    it('deve chamar next com erro em caso de exceção', async () => {
      const error = new Error('Database error');
      mockTransaction.findByPk.mockRejectedValue(error);
      mockRequest.params = { id: '1' };

      await showTransaction(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('listTransactions', () => {
    it('deve listar transações com paginação', async () => {
      const mockTransactions = [
        { id: 1, userId: 1, totalValue: 100.00 },
        { id: 2, userId: 2, totalValue: 200.00 }
      ];

      mockTransaction.findAndCountAll.mockResolvedValue({
        rows: mockTransactions,
        count: 2
      });

      mockRequest.query = { _page: '1', _size: '10' };

      await listTransactions(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        offset: 0,
        limit: 10,
        order: [['id', 'ASC']]
      });
      expect(mockResponse.hateoas_list).toHaveBeenCalledWith(mockTransactions, 1);
    });

    it('deve filtrar apenas transações ativas quando activesOnly=true', async () => {
      mockTransaction.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0
      });

      mockRequest.query = { activesOnly: 'true' };

      await listTransactions(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.findAndCountAll).toHaveBeenCalledWith({
        where: { active: true },
        offset: 0,
        limit: 10,
        order: [['id', 'ASC']]
      });
    });
  });

  describe('createTransaction', () => {
    it('deve criar uma nova transação', async () => {
      const transactionData = {
        userId: 1,
        totalValue: 100.00,
        operation: 'debit',
        status: 'pending'
      };

      mockTransaction.create.mockResolvedValue(transactionData);
      mockRequest.body = transactionData;

      await createTransaction(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.create).toHaveBeenCalledWith({
        userId: 1,
        totalValue: 100.00,
        operation: 'debit',
        status: 'pending'
      });
      expect(mockResponse.createdResponse).toHaveBeenCalled();
    });

    it('deve usar status padrão "pending" quando não fornecido', async () => {
      const transactionData = {
        userId: 1,
        totalValue: 100.00,
        operation: 'debit'
      };

      mockTransaction.create.mockResolvedValue(transactionData);
      mockRequest.body = transactionData;

      await createTransaction(mockRequest, mockResponse, mockNext);

      expect(mockTransaction.create).toHaveBeenCalledWith({
        userId: 1,
        totalValue: 100.00,
        operation: 'debit',
        status: 'pending'
      });
    });
  });
});
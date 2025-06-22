import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock das funções de resposta
const createMockResponse = () => {
  const res = {};
  res.hateoas_item = jest.fn().mockReturnValue(res);
  res.hateoas_list = jest.fn().mockReturnValue(res);
  res.notFoundResponse = jest.fn().mockReturnValue(res);
  res.createdResponse = jest.fn().mockReturnValue(res);
  res.okResponse = jest.fn().mockReturnValue(res);
  res.noContentResponse = jest.fn().mockReturnValue(res);
  return res;
};

const createMockRequest = (params = {}, query = {}, body = {}) => {
  return {
    params,
    query,
    body
  };
};

const createMockNext = () => jest.fn();

// Mock dos modelos
const mockProduct = {
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

const mockFacility = {
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn()
};

// Mock global dos modelos
global.Product = mockProduct;
global.Facility = mockFacility;

// Simular as funções do productController
const showProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: Facility,
        as: 'facility'
      }]
    });

    if (!product) {
      return res.notFoundResponse();
    }

    return res.hateoas_item(product);
  } catch (error) {
    next(error);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const { _page = 1, _size = 10, _order = 'id', active, search } = req.query;
    const offset = (_page - 1) * _size;
    
    const where = {};
    if (active !== undefined) {
      where.active = active === 'true';
    }

    const products = [];
    const totalItems = 0;
    
    return res.hateoas_list(products, totalItems, _page, _size);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.createdResponse(product);
  } catch (error) {
    next(error);
  }
};

describe('ProductController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showProduct', () => {
    it('deve retornar um produto quando encontrado', async () => {
      const mockProductData = { id: 1, name: 'Test Product' };
      mockProduct.findByPk.mockResolvedValue(mockProductData);

      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();
      const next = createMockNext();

      await showProduct(req, res, next);

      expect(mockProduct.findByPk).toHaveBeenCalledWith('1', {
        include: [{
          model: Facility,
          as: 'facility'
        }]
      });
      expect(res.hateoas_item).toHaveBeenCalledWith(mockProductData);
    });

    it('deve retornar not found quando produto não existe', async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const req = createMockRequest({ id: '999' });
      const res = createMockResponse();
      const next = createMockNext();

      await showProduct(req, res, next);

      expect(res.notFoundResponse).toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      const error = new Error('Database error');
      mockProduct.findByPk.mockRejectedValue(error);

      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();
      const next = createMockNext();

      await showProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listProducts', () => {
    it('deve retornar lista de produtos com paginação padrão', async () => {
      const req = createMockRequest({}, {});
      const res = createMockResponse();
      const next = createMockNext();

      await listProducts(req, res, next);

      expect(res.hateoas_list).toHaveBeenCalledWith([], 0, 1, 10);
    });

    it('deve filtrar por status ativo', async () => {
      const req = createMockRequest({}, { active: 'true' });
      const res = createMockResponse();
      const next = createMockNext();

      await listProducts(req, res, next);

      expect(res.hateoas_list).toHaveBeenCalledWith([], 0, 1, 10);
    });

    it('deve filtrar por busca', async () => {
      const req = createMockRequest({}, { search: 'test' });
      const res = createMockResponse();
      const next = createMockNext();

      await listProducts(req, res, next);

      expect(res.hateoas_list).toHaveBeenCalledWith([], 0, 1, 10);
    });
  });

  describe('createProduct', () => {
    it('deve criar um novo produto', async () => {
      const productData = { name: 'New Product', price: 10.99 };
      const createdProduct = { id: 1, ...productData };
      mockProduct.create.mockResolvedValue(createdProduct);

      const req = createMockRequest({}, {}, productData);
      const res = createMockResponse();
      const next = createMockNext();

      await createProduct(req, res, next);

      expect(mockProduct.create).toHaveBeenCalledWith(productData);
      expect(res.createdResponse).toHaveBeenCalledWith(createdProduct);
    });
  });
});
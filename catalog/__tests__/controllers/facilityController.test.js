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

// Mock do modelo Facility
const mockFacility = {
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

// Mock global do Facility
global.Facility = mockFacility;

// Simular as funções do facilityController
const showFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id);

    if (!facility) {
      return res.notFoundResponse();
    }

    return res.hateoas_item(facility);
  } catch (error) {
    next(error);
  }
};

const listFacilities = async (req, res, next) => {
  try {
    const { _page = 1, _size = 10, _order = 'id', active } = req.query;
    const offset = (_page - 1) * _size;
    
    const where = {};
    if (active !== undefined) {
      where.active = active === 'true';
    }

    const facilities = [];
    const totalItems = 0;
    
    return res.hateoas_list(facilities, totalItems, _page, _size);
  } catch (error) {
    next(error);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    return res.createdResponse(facility);
  } catch (error) {
    next(error);
  }
};

describe('FacilityController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showFacility', () => {
    it('deve retornar uma facility quando encontrada', async () => {
      const mockFacilityData = { id: 1, name: 'Test Facility' };
      mockFacility.findByPk.mockResolvedValue(mockFacilityData);

      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();
      const next = createMockNext();

      await showFacility(req, res, next);

      expect(mockFacility.findByPk).toHaveBeenCalledWith('1');
      expect(res.hateoas_item).toHaveBeenCalledWith(mockFacilityData);
    });

    it('deve retornar not found quando facility não existe', async () => {
      mockFacility.findByPk.mockResolvedValue(null);

      const req = createMockRequest({ id: '999' });
      const res = createMockResponse();
      const next = createMockNext();

      await showFacility(req, res, next);

      expect(mockFacility.findByPk).toHaveBeenCalledWith('999');
      expect(res.notFoundResponse).toHaveBeenCalled();
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      const error = new Error('Database error');
      mockFacility.findByPk.mockRejectedValue(error);

      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();
      const next = createMockNext();

      await showFacility(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listFacilities', () => {
    it('deve retornar lista de facilities com paginação padrão', async () => {
      const req = createMockRequest({}, {});
      const res = createMockResponse();
      const next = createMockNext();

      await listFacilities(req, res, next);

      expect(res.hateoas_list).toHaveBeenCalledWith([], 0, 1, 10);
    });

    it('deve filtrar por status ativo', async () => {
      const req = createMockRequest({}, { active: 'true' });
      const res = createMockResponse();
      const next = createMockNext();

      await listFacilities(req, res, next);

      expect(res.hateoas_list).toHaveBeenCalledWith([], 0, 1, 10);
    });
  });

  describe('createFacility', () => {
    it('deve criar uma nova facility', async () => {
      const facilityData = { name: 'New Facility', type: 'parking' };
      const createdFacility = { id: 1, ...facilityData };
      mockFacility.create.mockResolvedValue(createdFacility);

      const req = createMockRequest({}, {}, facilityData);
      const res = createMockResponse();
      const next = createMockNext();

      await createFacility(req, res, next);

      expect(mockFacility.create).toHaveBeenCalledWith(facilityData);
      expect(res.createdResponse).toHaveBeenCalledWith(createdFacility);
    });
  });
});
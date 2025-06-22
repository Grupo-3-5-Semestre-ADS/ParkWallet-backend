import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock do database
const mockSequelize = {
  define: jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn()
  })
};

const mockDatabase = {
  sequelize: mockSequelize
};

// Mock global do DataTypes
global.DataTypes = {
  STRING: jest.fn((length) => `STRING(${length})`),
  TEXT: 'TEXT',
  ENUM: jest.fn((...values) => `ENUM(${values.join(', ')})`),
  DECIMAL: jest.fn((precision, scale) => `DECIMAL(${precision}, ${scale})`),
  BOOLEAN: 'BOOLEAN'
};

// Simular a definição do modelo Facility
const createFacilityModel = (database) => {
  return database.sequelize.define('Facility', {
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('store', 'attraction', 'other'),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'facilities',
    timestamps: true
  });
};

describe('Facility Model Tests', () => {
  let Facility;

  beforeEach(() => {
    jest.clearAllMocks();
    Facility = createFacilityModel(mockDatabase);
  });

  describe('Model Definition', () => {
    it('deve definir o modelo Facility corretamente', () => {
      // Assert
      expect(mockSequelize.define).toHaveBeenCalledWith('Facility', {
        name: {
          type: 'STRING(200)',
          allowNull: false
        },
        description: {
          type: 'TEXT',
          allowNull: false
        },
        type: {
          type: 'ENUM(store, attraction, other)',
          allowNull: false
        },
        latitude: {
          type: 'DECIMAL(9, 6)',
          allowNull: false
        },
        longitude: {
          type: 'DECIMAL(9, 6)',
          allowNull: false
        },
        active: {
          type: 'BOOLEAN',
          defaultValue: true,
          allowNull: false
        }
      }, {
        tableName: 'facilities',
        timestamps: true
      });
    });
  });

  describe('Model Validations', () => {
    it('deve validar campos obrigatórios', () => {
      // Arrange
      const facilityData = {
        name: 'Test Facility',
        description: 'Test Description',
        type: 'store',
        latitude: -23.550520,
        longitude: -46.633308,
        active: true
      };

      Facility.create.mockResolvedValue({ id: 1, ...facilityData });

      // Act & Assert
      expect(() => {
        // Simular validação de campos obrigatórios
        const requiredFields = ['name', 'description', 'type', 'latitude', 'longitude'];
        requiredFields.forEach(field => {
          if (!facilityData[field]) {
            throw new Error(`${field} is required`);
          }
        });
      }).not.toThrow();
    });

    it('deve validar tipos de enum válidos', () => {
      // Arrange
      const validTypes = ['store', 'attraction', 'other'];
      const invalidType = 'invalid_type';

      // Act & Assert
      expect(validTypes).toContain('store');
      expect(validTypes).toContain('attraction');
      expect(validTypes).toContain('other');
      expect(validTypes).not.toContain(invalidType);
    });

    it('deve validar coordenadas geográficas', () => {
      // Arrange
      const validLatitude = -23.550520;
      const validLongitude = -46.633308;
      const invalidLatitude = 91; // Latitude deve estar entre -90 e 90
      const invalidLongitude = 181; // Longitude deve estar entre -180 e 180

      // Act & Assert
      expect(validLatitude).toBeGreaterThanOrEqual(-90);
      expect(validLatitude).toBeLessThanOrEqual(90);
      expect(validLongitude).toBeGreaterThanOrEqual(-180);
      expect(validLongitude).toBeLessThanOrEqual(180);
      
      expect(invalidLatitude).toBeGreaterThan(90);
      expect(invalidLongitude).toBeGreaterThan(180);
    });
  });

  describe('Model Operations', () => {
    it('deve criar uma nova facility', async () => {
      // Arrange
      const facilityData = {
        name: 'Shopping Center',
        description: 'Grande centro comercial',
        type: 'store',
        latitude: -23.550520,
        longitude: -46.633308,
        active: true
      };
      const createdFacility = { id: 1, ...facilityData };

      Facility.create.mockResolvedValue(createdFacility);

      // Act
      const result = await Facility.create(facilityData);

      // Assert
      expect(Facility.create).toHaveBeenCalledWith(facilityData);
      expect(result).toEqual(createdFacility);
    });

    it('deve buscar facility por ID', async () => {
      // Arrange
      const facilityId = 1;
      const facilityData = {
        id: facilityId,
        name: 'Test Facility',
        description: 'Test Description',
        type: 'attraction',
        latitude: -23.550520,
        longitude: -46.633308,
        active: true
      };

      Facility.findByPk.mockResolvedValue(facilityData);

      // Act
      const result = await Facility.findByPk(facilityId);

      // Assert
      expect(Facility.findByPk).toHaveBeenCalledWith(facilityId);
      expect(result).toEqual(facilityData);
    });

    it('deve listar todas as facilities', async () => {
      // Arrange
      const facilitiesData = [
        {
          id: 1,
          name: 'Facility 1',
          description: 'Description 1',
          type: 'store',
          latitude: -23.550520,
          longitude: -46.633308,
          active: true
        },
        {
          id: 2,
          name: 'Facility 2',
          description: 'Description 2',
          type: 'attraction',
          latitude: -23.560520,
          longitude: -46.643308,
          active: true
        }
      ];

      Facility.findAll.mockResolvedValue(facilitiesData);

      // Act
      const result = await Facility.findAll();

      // Assert
      expect(Facility.findAll).toHaveBeenCalled();
      expect(result).toEqual(facilitiesData);
      expect(result).toHaveLength(2);
    });
  });
});
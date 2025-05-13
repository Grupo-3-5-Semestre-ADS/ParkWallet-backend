import { faker } from '@faker-js/faker/locale/pt_BR';
import dotenv from 'dotenv';
import Facility from './models/facilityModel.js';
import Product from './models/productModel.js';

dotenv.config();

const NUM_FACILITIES = 50;
const PRODUCTS_PER_FACILITY_MIN = 20;
const PRODUCTS_PER_FACILITY_MAX = 20;

const MAP_BOUNDS = {
  north: -25.1480,
  south: -25.1680,
  east: -54.2900,
  west: -54.3100,
};

const seedDatabase = async () => {
    const createdFacilities = [];

    for (let i = 0; i < NUM_FACILITIES; i++) {
      const facilityData = {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement(['store', 'attraction', 'other']),
        latitude: faker.location.latitude({
          min: MAP_BOUNDS.south,
          max: MAP_BOUNDS.north,
        }),
        longitude: faker.location.longitude({
          min: MAP_BOUNDS.west,
          max: MAP_BOUNDS.east,
        }),
        inactive: faker.datatype.boolean(0.1),
      };
      try {
        const newFacility = await Facility.create(facilityData);
        createdFacilities.push(newFacility);
      } catch (error) {
        console.error(error);
      }
    }

    if (createdFacilities.length === 0) {
        return;
    }

    for (const facility of createdFacilities) {
        const numProducts = faker.number.int({
            min: PRODUCTS_PER_FACILITY_MIN,
            max: PRODUCTS_PER_FACILITY_MAX
        });
        for (let j = 0; j < numProducts; j++) {
            const productData = {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
                inactive: faker.datatype.boolean(0.05),
                facilityId: facility.id,
            };
            try {
                await Product.create(productData);
            } catch (error) {
              console.error(error);
            }
        }
    }
};

export { seedDatabase };

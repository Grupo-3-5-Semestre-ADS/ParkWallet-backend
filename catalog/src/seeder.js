import { faker } from '@faker-js/faker/locale/pt_BR';
import dotenv from 'dotenv';
import Facility from './models/facilityModel.js';
import Product from './models/productModel.js';

dotenv.config();

const NUM_FACILITIES = 30;
const PRODUCTS_PER_FACILITY_MIN = 0;
const PRODUCTS_PER_FACILITY_MAX = 20;

const seedDatabase = async () => {
    const createdFacilities = [];

    for (let i = 0; i < NUM_FACILITIES; i++) {
      const facilityData = {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement(['store', 'attraction', 'other']),
        latitude: faker.location.latitude({ min: -24, max: -22 }),
        longitude: faker.location.longitude({ min: -47, max: -43 }),
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

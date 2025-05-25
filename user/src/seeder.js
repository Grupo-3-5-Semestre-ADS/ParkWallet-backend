import {faker} from '@faker-js/faker/locale/pt_BR';
import dotenv from 'dotenv';
import User from "./models/userModel.js";

dotenv.config();

const ADMIN_USER_ID = 1;
const MIN_CLIENT_USER_ID = 2;
const MAX_CLIENT_USER_ID = 30;

export const seedDatabase = async () => {
  await User.create({
    id: ADMIN_USER_ID,
    name: 'Admin',
    email: 'admin@admin.com',
    cpf: '12345678901',
    password: 'Admin123',
    birthdate: '1970-01-01',
    active: true,
    role: 'ADMIN'
  });


  for (let clientId = MIN_CLIENT_USER_ID; clientId <= MAX_CLIENT_USER_ID; clientId++) {
    await User.create({
      id: clientId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(11),
      password: 'Customer123',
      birthdate: faker.date.birthdate({min: 18, max: 65, mode: 'age'}).toISOString().split('T')[0],
      active: true,
      role: 'CUSTOMER'
    });
  }
};

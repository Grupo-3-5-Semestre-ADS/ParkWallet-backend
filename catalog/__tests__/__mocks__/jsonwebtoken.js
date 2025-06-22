import { jest } from '@jest/globals';

const jwt = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    role: 'user'
  }),
  decode: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    role: 'user'
  })
};

export default jwt;
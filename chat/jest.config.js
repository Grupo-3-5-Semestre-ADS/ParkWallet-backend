export default {
  testEnvironment: 'node',
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/routes.js',
    '!src/swagger.js',
    '!src/seeder.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/testSetup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['js', 'json'],
  testTimeout: 10000,
};
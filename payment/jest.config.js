export default {
  testEnvironment: 'node',
  transform: {
    '^.+\.js$': 'babel-jest'
  },
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/routes.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/testSetup.js'],
  moduleFileExtensions: ['js', 'json'],
  verbose: true
};
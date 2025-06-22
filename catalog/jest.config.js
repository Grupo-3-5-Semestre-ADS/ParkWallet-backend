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
    '!src/swagger.js',
    '!src/seeder.js',
    '!src/routes.js'
  ]
};
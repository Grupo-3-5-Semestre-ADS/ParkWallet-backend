# Notification Microservice Test Suite

This directory contains the test suite for the notification microservice.

## Test Structure

```
__tests__/
├── controllers/
│   └── notificationController.test.js  # Unit tests for notification controller
├── setup/
│   └── testSetup.js                    # Test environment configuration
└── README.md                           # This file
```

## Test Types

### Unit Tests
- **Controller Tests**: Test individual controller functions
  - `showNotification` - Get single notification
  - `listNotifications` - Get paginated notifications
  - `createNotification` - Create new notification
  - `editNotification` - Update existing notification
  - `deleteNotification` - Delete notification

## Configuration

### Jest Configuration
- **Environment**: Node.js
- **Transform**: Babel for ES6+ support
- **Coverage**: Collects from `src/**/*.js` (excluding server, app, routes, swagger, seeder)
- **Timeout**: 10 seconds

### Babel Configuration
- **Preset**: `@babel/preset-env` targeting current Node.js version

### Test Setup
- Environment variables for testing
- Global mocks for fetch and console
- Automatic mock clearing/restoration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **LCOV**: For CI/CD integration
- **HTML**: Detailed browser-viewable report in `coverage/` directory

## Test Scenarios

### Notification Controller Tests
1. **Function Existence**: Verify all controller functions exist
2. **Basic Functionality**: Test basic function calls and mock implementations
3. **Response Object**: Verify mock response object structure

## Testing Patterns

### Mocking
- Simple `jest.fn()` mocks for controller functions
- Mock request/response objects with necessary methods
- Global mocks for external dependencies

### Assertions
- Function type checking
- Function call verification
- Mock implementation testing

## Dependencies

### Test Dependencies
- `jest`: Testing framework
- `@jest/globals`: Jest globals for ES modules
- `babel-jest`: Babel integration for Jest
- `@babel/core` & `@babel/preset-env`: Babel transpilation
- `cross-env`: Cross-platform environment variables
- `supertest`: HTTP assertion library (for future integration tests)

## Environment Variables

Test environment uses these variables:
- `NODE_ENV=test`
- `DB_HOST=localhost`
- `DB_USER=test`
- `DB_PASS=test`
- `DB_NAME=test_db`
- `JWT_SECRET=test_secret`

## Next Steps

1. **Integration Tests**: Add API endpoint testing
2. **Model Tests**: Test Sequelize model functionality
3. **Middleware Tests**: Test custom middleware functions
4. **Error Handling**: Add comprehensive error scenario testing
5. **Database Integration**: Add database testing with test database

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are mocked to focus on unit logic
3. **Clarity**: Test names clearly describe what is being tested
4. **Coverage**: Aim for high code coverage while maintaining meaningful tests
5. **Maintenance**: Keep tests simple and maintainable
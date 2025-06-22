# Chat Microservice Test Suite

This directory contains comprehensive test suites for the Chat microservice, including unit tests, integration tests, and test configuration.

## Test Structure

```
__tests__/
├── README.md                    # This documentation
├── setup/
│   └── testSetup.js            # Test environment configuration
├── controllers/
│   └── chatController.test.js  # Unit tests for chat controller
└── integration/
    └── chats.test.js           # Integration tests for chat routes
```

## Types of Tests

### Unit Tests
- **Location**: `controllers/chatController.test.js`
- **Purpose**: Test individual controller functions in isolation
- **Coverage**: 
  - `listUserChats` - Retrieve chat messages for a specific user
  - `createChat` - Create new chat messages
  - `listClientConversations` - Get client conversation summaries
  - Error handling and edge cases

### Integration Tests
- **Location**: `integration/chats.test.js`
- **Purpose**: Test complete request-response cycles
- **Coverage**:
  - GET `/api/chats/user/:userId` - User chat retrieval
  - POST `/api/chats` - Chat message creation
  - GET `/api/chats/conversations` - Client conversations
  - Error handling and validation

## Configuration

### Jest Configuration
- **File**: `jest.config.js`
- **Environment**: Node.js
- **Transform**: Babel for ES6+ support
- **Coverage**: Excludes server, app, routes, and seeder files
- **Timeout**: 10 seconds for async operations

### Babel Configuration
- **File**: `babel.config.js`
- **Preset**: `@babel/preset-env` targeting current Node.js

### Test Setup
- **File**: `setup/testSetup.js`
- **Features**:
  - Environment variables configuration
  - Mock clearing and restoration
  - Console method mocking
  - Global fetch mocking

## Running Tests

### Execute All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **LCOV**: `coverage/lcov.info`
- **HTML**: `coverage/index.html`

## Test Scenarios

### Chat Controller Tests
1. **User Chat Retrieval**
   - Successful chat retrieval
   - Error handling for database failures

2. **Chat Creation**
   - Successful message creation
   - Error handling for creation failures

3. **Client Conversations**
   - Empty conversation list handling
   - Error handling for database failures

### Integration Tests
1. **Route Testing**
   - Valid request handling
   - Invalid parameter handling
   - Missing field validation
   - Content-type validation

2. **Error Scenarios**
   - 404 for non-existent routes
   - 400 for malformed JSON
   - 415 for incorrect content-type

## Testing Patterns

### Mocking Strategy
- **Models**: Mock database operations
- **External APIs**: Mock axios requests
- **Controllers**: Mock for integration tests
- **Environment**: Isolated test environment

### Assertion Patterns
- Status code verification
- Response body validation
- Function call verification
- Error handling confirmation

## Dependencies

### Test Dependencies
- `jest`: Testing framework
- `supertest`: HTTP assertion library
- `@babel/core` & `@babel/preset-env`: ES6+ support
- `babel-jest`: Babel integration for Jest
- `cross-env`: Environment variable management

## Environment Variables

Test environment uses these variables:
- `NODE_ENV=test`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_NAME=test_chat_db`
- `DB_USER=test`
- `DB_PASS=test`
- `GATEWAY_HOST=localhost`
- `GATEWAY_PORT=3000`

## Next Steps

1. **Model Tests**: Add unit tests for Chat model
2. **Middleware Tests**: Test authentication and validation middleware
3. **E2E Tests**: Add end-to-end testing with real database
4. **Performance Tests**: Add load testing for chat endpoints
5. **Security Tests**: Add security-focused test scenarios

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: Aim for high code coverage while focusing on critical paths
4. **Readability**: Tests are well-documented and easy to understand
5. **Maintenance**: Regular updates to keep tests current with code changes
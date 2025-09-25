# SlickText API v2 Mock Testing System

This directory contains comprehensive testing infrastructure for the SlickText API v2 integration, including mock services, test utilities, and automated test suites.

## 🎯 Overview

The mock testing system allows you to:

- Test all SlickText functionality without hitting the live API
- Simulate various error scenarios and edge cases
- Run performance tests with realistic data
- Test webhook processing and event handling
- Validate API integration logic in isolation

## 📁 File Structure

```
tests/
├── README.md                    # This file
├── setup.ts                     # Jest global setup
├── slicktext.test.ts            # Main test suite
└── __mocks__/                   # Additional mock utilities (if needed)

src/mocks/
├── slicktextMockData.ts         # Mock data and types
├── slicktextMockService.ts      # Mock service implementation
└── slicktextServiceWrapper.ts   # Service wrapper for mock/real switching
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run only SlickText tests
npm run test:slicktext

# Run tests in watch mode
npm run test:slicktext:watch

# Run tests with coverage
npm run test:coverage
```

### 3. Manual Testing via API

Start the development server:

```bash
npm run dev
```

Test endpoints are available at:

- `GET /api/test/slicktext/status` - Service status
- `POST /api/test/slicktext/mode` - Switch between mock/real mode
- `POST /api/test/slicktext/workflow` - Complete workflow test

## 🧪 Test Categories

### Unit Tests

- Individual service method testing
- Error handling validation
- Input validation testing
- Response format verification

### Integration Tests

- Complete workflow testing
- Service wrapper functionality
- Mock/real mode switching
- End-to-end API flow testing

### Performance Tests

- Concurrent request handling
- Large batch operations
- Network delay simulation
- Memory usage validation

## 📊 Mock Data

The mock system includes realistic test data for:

### Lists

- Main Subscribers (1,250 contacts)
- VIP Customers (89 contacts)
- Newsletter Subscribers (3,421 contacts)

### Contacts

- Sample contact records with realistic data
- Various phone number formats
- Custom field examples

### Campaigns

- Completed campaigns with full statistics
- Scheduled campaigns
- Draft campaigns

### Auto-Replies

- STOP keyword handling
- START keyword handling
- HELP keyword handling

### Webhook Events

- Message delivery events
- Message failure events
- Subscriber opt-in/opt-out events

## 🔧 Configuration

### Environment Variables

```bash
# Enable mock mode
USE_MOCKS=true

# Test environment
NODE_ENV=test

# Mock delay simulation (milliseconds)
MOCK_DELAY_MS=100
```

### Jest Configuration

The `jest.config.js` file includes:

- TypeScript support via ts-jest
- Coverage reporting
- Test timeout configuration
- Global setup and teardown

## 🎭 Mock Service Features

### Realistic Responses

All mock responses match the real SlickText API v2 structure, including:

- Proper HTTP status codes
- Consistent response formats
- Realistic data types and values
- Error message formatting

### Error Simulation

Test various error scenarios:

- Authentication failures
- Validation errors
- Rate limiting
- Network timeouts
- Server errors

### Performance Testing

- Configurable delay simulation
- Concurrent request handling
- Batch operation testing
- Memory usage monitoring

### Webhook Testing

- Mock webhook event generation
- Signature verification simulation
- Event processing validation
- Error handling testing

## 📝 Writing Tests

### Basic Test Structure

```typescript
describe("SlickText Mock Service", () => {
  let mockService: SlickTextMockService;

  beforeEach(() => {
    mockService = new SlickTextMockService(10); // Fast mock
  });

  test("should send message successfully", async () => {
    const result = await mockService.mockSendMessage(
      "list_123456789",
      "Test message content"
    );

    expect(result.success).toBe(true);
    expect(result.data?.content).toBe("Test message content");
  });
});
```

### Error Testing

```typescript
test("should return error for invalid list ID", async () => {
  const result = await mockService.mockSendMessage(
    "invalid_list_id",
    "Test message"
  );

  expect(result.success).toBe(false);
  expect(result.error).toContain("not found");
});
```

### Integration Testing

```typescript
test("should complete full messaging workflow", async () => {
  const serviceWrapper = new SlickTextServiceWrapper();

  // 1. Get lists
  const listsResult = await serviceWrapper.getLists();
  expect(listsResult.success).toBe(true);

  // 2. Subscribe contact
  const subscribeResult = await serviceWrapper.subscribeContact(
    listsResult.data[0].id,
    "+1234567890"
  );
  expect(subscribeResult.success).toBe(true);

  // 3. Send message
  const messageResult = await serviceWrapper.sendMessage(
    listsResult.data[0].id,
    "Test message"
  );
  expect(messageResult.success).toBe(true);
});
```

## 🚨 Error Handling Tests

### Authentication Errors

```typescript
test("should handle authentication failure", async () => {
  const result = await mockService.mockGenerateError("authentication_failed");

  expect(result.success).toBe(false);
  expect(result.error).toContain("Authentication failed");
});
```

### Validation Errors

```typescript
test("should validate required fields", async () => {
  const result = await mockService.mockSendMessage("", "");

  expect(result.success).toBe(false);
  expect(result.error).toContain("required");
});
```

### Rate Limiting

```typescript
test("should handle rate limiting", async () => {
  const result = await mockService.mockGenerateError("rate_limit_exceeded");

  expect(result.success).toBe(false);
  expect(result.error).toContain("Rate limit exceeded");
});
```

## 🔄 Service Wrapper Testing

The service wrapper allows switching between mock and real API calls:

```typescript
describe("Service Wrapper", () => {
  test("should use mock service when forced to mock mode", () => {
    forceMockMode();
    expect(isUsingMocks()).toBe(true);
  });

  test("should delegate calls to appropriate service", async () => {
    forceMockMode();
    const result = await serviceWrapper.sendMessage("list_123", "test");
    expect(result.success).toBe(true);
  });
});
```

## 📈 Coverage Reports

Run tests with coverage to see test coverage statistics:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and include:

- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## 🐛 Debugging Tests

### Enable Debug Logging

```typescript
// In test files
console.log("Debug info:", result);
```

### Run Specific Tests

```bash
# Run specific test file
npm test -- slicktext.test.ts

# Run specific test suite
npm test -- --testNamePattern="sendMessage"

# Run tests matching pattern
npm test -- --testPathPattern="mock"
```

### Watch Mode

```bash
# Watch for file changes
npm run test:watch

# Watch specific tests
npm run test:slicktext:watch
```

## 🔧 Customizing Mock Data

### Adding New Mock Data

Edit `src/mocks/slicktextMockData.ts`:

```typescript
export const newMockData = [
  {
    id: "new_id_123",
    // ... your mock data
  },
];
```

### Creating Custom Mock Functions

Edit `src/mocks/slicktextMockService.ts`:

```typescript
async mockCustomFunction(param: string): Promise<MockSlickTextResponse<CustomType>> {
  await this.simulateDelay();

  // Your mock logic here
  return {
    success: true,
    data: customMockData,
  };
}
```

## 📚 Best Practices

### Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Test both success and failure cases
- Include edge cases and boundary conditions

### Mock Data

- Use realistic data that matches production
- Include various data types and formats
- Test with both valid and invalid data
- Cover different scenarios and states

### Error Testing

- Test all possible error conditions
- Verify error messages are helpful
- Test error recovery mechanisms
- Validate error logging and monitoring

### Performance Testing

- Test with realistic data volumes
- Simulate network conditions
- Test concurrent operations
- Monitor resource usage

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure
2. Include both positive and negative test cases
3. Add appropriate mock data if needed
4. Update documentation if adding new features
5. Ensure tests pass in both mock and real modes

## 📞 Support

For questions about the testing system:

- Check the test files for examples
- Review the mock service implementation
- Consult the SlickText API documentation
- Contact the development team

---

**Happy Testing! 🎉**

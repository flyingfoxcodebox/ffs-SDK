# 🧪 SlickText API v2 Mock Testing Guide

## 🎯 Quick Start

### 1. Enable Mock Mode

```bash
# Set environment variable
export USE_MOCKS=true

# Or add to your .env file
echo "USE_MOCKS=true" >> .env
```

### 2. Run Tests

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run only SlickText tests
npm run test:slicktext

# Run with coverage
npm run test:coverage
```

### 3. Test via API Endpoints

```bash
# Start the server
npm run dev

# Test service status
curl http://localhost:3001/api/test/slicktext/status

# Switch to mock mode
curl -X POST http://localhost:3001/api/test/slicktext/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "mock"}'

# Test sending a message
curl -X POST http://localhost:3001/api/test/slicktext/send \
  -H "Content-Type: application/json" \
  -d '{"listId": "list_123456789", "content": "Test message"}'

# Test complete workflow
curl -X POST http://localhost:3001/api/test/slicktext/workflow
```

## 🔧 Available Test Endpoints

| Method | Endpoint                                  | Description                   |
| ------ | ----------------------------------------- | ----------------------------- |
| GET    | `/api/test/slicktext/status`              | Get current service status    |
| POST   | `/api/test/slicktext/mode`                | Switch between mock/real mode |
| POST   | `/api/test/slicktext/send`                | Test sending a message        |
| POST   | `/api/test/slicktext/subscribe`           | Test subscribing a contact    |
| GET    | `/api/test/slicktext/lists`               | Test getting lists            |
| GET    | `/api/test/slicktext/campaigns/:id/stats` | Test getting campaign stats   |
| POST   | `/api/test/slicktext/auto-reply`          | Test creating auto-reply      |
| GET    | `/api/test/slicktext/balance`             | Test getting account balance  |
| POST   | `/api/test/slicktext/webhook`             | Test webhook processing       |
| GET    | `/api/test/slicktext/webhook-events`      | Get webhook event examples    |
| POST   | `/api/test/slicktext/error`               | Test error handling           |
| POST   | `/api/test/slicktext/workflow`            | Test complete workflow        |

## 📊 Mock Data Available

### Lists

- `list_123456789` - Main Subscribers (1,250 contacts)
- `list_987654321` - VIP Customers (89 contacts)
- `list_555666777` - Newsletter Subscribers (3,421 contacts)

### Contacts

- `contact_111222333` - John Doe (+1234567890)
- `contact_444555666` - Jane Smith (+1987654321)
- `contact_777888999` - Bob Johnson (+1555666777)

### Campaigns

- `camp_111222333` - Welcome Campaign (completed)
- `camp_444555666` - Flash Sale Campaign (scheduled)
- `camp_777888999` - VIP Exclusive Offer (sent)

## 🎭 Error Testing

Test different error scenarios:

```bash
# Authentication error
curl -X POST http://localhost:3001/api/test/slicktext/error \
  -H "Content-Type: application/json" \
  -d '{"errorType": "authentication_failed"}'

# Validation error
curl -X POST http://localhost:3001/api/test/slicktext/error \
  -H "Content-Type: application/json" \
  -d '{"errorType": "validation_error"}'

# Rate limit error
curl -X POST http://localhost:3001/api/test/slicktext/error \
  -H "Content-Type: application/json" \
  -d '{"errorType": "rate_limit_exceeded"}'
```

## 🔄 Switching Between Modes

### Programmatically

```typescript
import {
  forceMockMode,
  forceRealMode,
  isUsingMocks,
} from "./src/mocks/slicktextServiceWrapper";

// Switch to mock mode
forceMockMode();
console.log("Using mocks:", isUsingMocks()); // true

// Switch to real API mode
forceRealMode();
console.log("Using mocks:", isUsingMocks()); // false
```

### Via API

```bash
# Switch to mock mode
curl -X POST http://localhost:3001/api/test/slicktext/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "mock"}'

# Switch to real mode
curl -X POST http://localhost:3001/api/test/slicktext/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "real"}'
```

## 🧪 Writing Custom Tests

### Basic Test Example

```typescript
import { SlickTextMockService } from "../src/mocks/slicktextMockService";

describe("My Custom Tests", () => {
  let mockService: SlickTextMockService;

  beforeEach(() => {
    mockService = new SlickTextMockService(10); // Fast mock
  });

  test("should handle my custom scenario", async () => {
    const result = await mockService.mockSendMessage(
      "list_123456789",
      "Custom test message"
    );

    expect(result.success).toBe(true);
    expect(result.data?.content).toBe("Custom test message");
  });
});
```

### Integration Test Example

```typescript
import { SlickTextServiceWrapper } from "../src/mocks/slicktextServiceWrapper";

describe("Integration Tests", () => {
  test("should complete custom workflow", async () => {
    const serviceWrapper = new SlickTextServiceWrapper();

    // Your custom workflow here
    const listsResult = await serviceWrapper.getLists();
    expect(listsResult.success).toBe(true);

    // Add more steps as needed
  });
});
```

## 📈 Performance Testing

### Concurrent Requests

```typescript
test("should handle multiple concurrent requests", async () => {
  const promises = Array.from({ length: 10 }, (_, i) =>
    mockService.mockSendMessage("list_123456789", `Message ${i}`)
  );

  const results = await Promise.all(promises);
  results.forEach((result) => {
    expect(result.success).toBe(true);
  });
});
```

### Large Batch Operations

```typescript
test("should handle large batch operations", async () => {
  const promises = Array.from({ length: 50 }, (_, i) =>
    mockService.mockSubscribeContact(
      "list_123456789",
      `+1234567${i.toString().padStart(3, "0")}`,
      { firstName: `User${i}` }
    )
  );

  const results = await Promise.all(promises);
  results.forEach((result) => {
    expect(result.success).toBe(true);
  });
});
```

## 🔍 Debugging

### Enable Debug Logging

```typescript
// In your test files
console.log("Debug info:", result);

// Or use Jest's built-in logging
expect(result).toMatchObject({
  success: true,
  data: expect.objectContaining({
    content: expect.any(String),
  }),
});
```

### Run Specific Tests

```bash
# Run specific test file
npm test slicktext.test.ts

# Run specific test suite
npm test -- --testNamePattern="sendMessage"

# Run tests matching pattern
npm test -- --testPathPattern="mock"
```

## 📚 Additional Resources

- **Full Documentation**: `docs/integrations/slicktext.md`
- **Test Documentation**: `tests/README.md`
- **Mock Data**: `src/mocks/slicktextMockData.ts`
- **Mock Service**: `src/mocks/slicktextMockService.ts`
- **Service Wrapper**: `src/mocks/slicktextServiceWrapper.ts`

## 🚨 Important Notes

1. **Mock Mode**: Always use `USE_MOCKS=true` for testing
2. **Real API**: Never use mock mode in production
3. **Environment**: Set `NODE_ENV=test` for test environment
4. **Coverage**: Aim for 80%+ test coverage
5. **Error Testing**: Test both success and failure scenarios

## 🎉 Success Criteria

Your SlickText integration is ready when:

- ✅ All tests pass in mock mode
- ✅ All tests pass in real mode (with valid credentials)
- ✅ Error scenarios are properly tested
- ✅ Performance tests show good results
- ✅ Documentation is complete and accurate

---

**Happy Testing! 🚀**

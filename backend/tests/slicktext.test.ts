/**
 * Flying Fox Solutions - SlickText API v2 Integration Tests
 *
 * Comprehensive test suite for SlickText integration including both
 * mock and real API testing capabilities.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { SlickTextMockService } from "../src/mocks/slicktextMockService";
import {
  SlickTextServiceWrapper,
  forceMockMode,
  forceRealMode,
  isUsingMocks,
} from "../src/mocks/slicktextServiceWrapper";
import {
  mockLists,
  mockContacts,
  mockCampaigns,
  mockErrors,
} from "../src/mocks/slicktextMockData";

// ============================================================================
// Test Configuration
// ============================================================================

// Set longer timeout for async operations
jest.setTimeout(10000);

// ============================================================================
// Mock Service Tests
// ============================================================================

describe("SlickText Mock Service", () => {
  let mockService: SlickTextMockService;

  beforeEach(() => {
    mockService = new SlickTextMockService(10); // Fast mock for testing
  });

  describe("sendMessage", () => {
    test("should send message successfully", async () => {
      const result = await mockService.mockSendMessage(
        "list_123456789",
        "Test message content"
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.content).toBe("Test message content");
      expect(result.data?.list_id).toBe("list_123456789");
      expect(result.data?.status).toBe("sent");
    });

    test("should schedule message when scheduledFor is provided", async () => {
      const scheduledFor = new Date("2024-12-31T23:59:00Z");
      const result = await mockService.mockSendMessage(
        "list_123456789",
        "Scheduled message",
        scheduledFor
      );

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe("queued");
      expect(result.data?.scheduled_for).toBe(scheduledFor.toISOString());
    });

    test("should return error for invalid list ID", async () => {
      const result = await mockService.mockSendMessage(
        "invalid_list_id",
        "Test message"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    test("should return error for empty content", async () => {
      const result = await mockService.mockSendMessage("list_123456789", "");

      expect(result.success).toBe(false);
      expect(result.error).toContain("required");
    });

    test("should return error for content too long", async () => {
      const longContent = "x".repeat(1601);
      const result = await mockService.mockSendMessage(
        "list_123456789",
        longContent
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("exceed 1600 characters");
    });
  });

  describe("subscribeContact", () => {
    test("should subscribe contact successfully", async () => {
      const result = await mockService.mockSubscribeContact(
        "list_123456789",
        "+1234567890",
        { firstName: "John", lastName: "Doe", email: "john@example.com" }
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.phone).toBe("+1234567890");
      expect(result.data?.list_id).toBe("list_123456789");
      expect(result.data?.first_name).toBe("John");
      expect(result.data?.last_name).toBe("Doe");
      expect(result.data?.email).toBe("john@example.com");
    });

    test("should return error for invalid list ID", async () => {
      const result = await mockService.mockSubscribeContact(
        "invalid_list_id",
        "+1234567890"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    test("should return error for empty phone number", async () => {
      const result = await mockService.mockSubscribeContact(
        "list_123456789",
        ""
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("required");
    });
  });

  describe("getCampaignStats", () => {
    test("should return campaign stats successfully", async () => {
      const result = await mockService.mockGetCampaignStats("camp_111222333");

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe("camp_111222333");
      expect(result.data?.sent_count).toBeDefined();
      expect(result.data?.delivered_count).toBeDefined();
      expect(result.data?.failed_count).toBeDefined();
    });

    test("should return error for invalid campaign ID", async () => {
      const result = await mockService.mockGetCampaignStats(
        "invalid_campaign_id"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });
  });

  describe("getLists", () => {
    test("should return all lists successfully", async () => {
      const result = await mockService.mockGetLists();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(result.data?.[0]).toHaveProperty("id");
      expect(result.data?.[0]).toHaveProperty("name");
      expect(result.data?.[0]).toHaveProperty("subscriber_count");
    });
  });

  describe("deleteSubscriber", () => {
    test("should delete subscriber successfully", async () => {
      const result = await mockService.mockDeleteSubscriber(
        "contact_111222333"
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe("contact_111222333");
      expect(result.data?.status).toBe("deleted");
    });

    test("should return error for invalid subscriber ID", async () => {
      const result = await mockService.mockDeleteSubscriber(
        "invalid_subscriber_id"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });
  });

  describe("createAutoReply", () => {
    test("should create auto-reply successfully", async () => {
      const result = await mockService.mockCreateAutoReply(
        "TEST",
        "This is a test auto-reply message",
        true
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.keyword).toBe("TEST");
      expect(result.data?.message).toBe("This is a test auto-reply message");
      expect(result.data?.is_active).toBe(true);
    });

    test("should return error for empty keyword", async () => {
      const result = await mockService.mockCreateAutoReply("", "Test message");

      expect(result.success).toBe(false);
      expect(result.error).toContain("required");
    });

    test("should return error for empty message", async () => {
      const result = await mockService.mockCreateAutoReply("TEST", "");

      expect(result.success).toBe(false);
      expect(result.error).toContain("required");
    });
  });

  describe("error handling", () => {
    test("should generate authentication error", async () => {
      const result = await mockService.mockGenerateError(
        "authentication_failed"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Authentication failed");
    });

    test("should generate validation error", async () => {
      const result = await mockService.mockGenerateError("validation_error");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
    });

    test("should generate rate limit error", async () => {
      const result = await mockService.mockGenerateError("rate_limit_exceeded");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Rate limit exceeded");
    });
  });
});

// ============================================================================
// Service Wrapper Tests
// ============================================================================

describe("SlickText Service Wrapper", () => {
  let serviceWrapper: SlickTextServiceWrapper;

  beforeEach(() => {
    serviceWrapper = new SlickTextServiceWrapper();
    forceMockMode(); // Ensure we're in mock mode for testing
  });

  afterEach(() => {
    forceRealMode(); // Reset to real mode after tests
  });

  test("should use mock service when forced to mock mode", () => {
    forceMockMode();
    expect(isUsingMocks()).toBe(true);
  });

  test("should use real service when forced to real mode", () => {
    forceRealMode();
    expect(isUsingMocks()).toBe(false);
  });

  test("should delegate sendMessage to appropriate service", async () => {
    forceMockMode();
    const result = await serviceWrapper.sendMessage(
      "list_123456789",
      "Test message"
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test("should delegate subscribeContact to appropriate service", async () => {
    forceMockMode();
    const result = await serviceWrapper.subscribeContact(
      "list_123456789",
      "+1234567890",
      { firstName: "Test" }
    );

    expect(result.success).toBe(true);
    expect(result.data?.phone).toBe("+1234567890");
  });

  test("should provide mock-specific methods when in mock mode", async () => {
    forceMockMode();

    const result = await serviceWrapper.mockGenerateError(
      "authentication_failed"
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain("Authentication failed");
  });

  test("should throw error when calling mock methods in real mode", async () => {
    forceRealMode();

    await expect(
      serviceWrapper.mockGenerateError("authentication_failed")
    ).rejects.toThrow("Mock methods are only available when USE_MOCKS=true");
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("SlickText Integration Tests", () => {
  beforeEach(() => {
    forceMockMode();
  });

  afterEach(() => {
    forceRealMode();
  });

  test("should complete full messaging workflow", async () => {
    const serviceWrapper = new SlickTextServiceWrapper();

    // 1. Get lists
    const listsResult = await serviceWrapper.getLists();
    expect(listsResult.success).toBe(true);
    expect(listsResult.data?.length).toBeGreaterThan(0);

    const listId = listsResult.data?.[0].id;
    expect(listId).toBeDefined();

    // 2. Subscribe a contact
    const subscribeResult = await serviceWrapper.subscribeContact(
      listId!,
      "+1234567890",
      { firstName: "Integration", lastName: "Test" }
    );
    expect(subscribeResult.success).toBe(true);

    // 3. Send a message
    const messageResult = await serviceWrapper.sendMessage(
      listId!,
      "Integration test message"
    );
    expect(messageResult.success).toBe(true);

    // 4. Get message history
    const historyResult = await serviceWrapper.getMessageHistory(10, 0);
    expect(historyResult.success).toBe(true);
    expect(historyResult.data?.length).toBeGreaterThan(0);
  });

  test("should handle campaign workflow", async () => {
    const serviceWrapper = new SlickTextServiceWrapper();

    // 1. Create auto-reply
    const autoReplyResult = await serviceWrapper.createAutoReply(
      "INTEGRATION",
      "Integration test auto-reply",
      true
    );
    expect(autoReplyResult.success).toBe(true);

    // 2. Get auto-replies
    const autoRepliesResult = await serviceWrapper.getAutoReplies();
    expect(autoRepliesResult.success).toBe(true);
    expect(autoRepliesResult.data?.length).toBeGreaterThan(0);

    // 3. Get campaign stats
    const statsResult = await serviceWrapper.getCampaignStats("camp_111222333");
    expect(statsResult.success).toBe(true);
    expect(statsResult.data?.sent_count).toBeDefined();
  });

  test("should handle webhook processing", async () => {
    const serviceWrapper = new SlickTextServiceWrapper();

    // 1. Verify webhook (always returns true in mock)
    const verifyResult = await serviceWrapper.verifyWebhook(
      "payload",
      "signature"
    );
    expect(verifyResult).toBe(true);

    // 2. Process webhook event
    const webhookPayload = {
      id: "event_123",
      type: "message.delivered",
      data: { message_id: "msg_123", phone: "+1234567890" },
    };

    const processResult = await serviceWrapper.processWebhook(webhookPayload);
    expect(processResult.success).toBe(true);
    expect(processResult.data?.status).toBe("processed");
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe("SlickText Performance Tests", () => {
  test("should handle multiple concurrent requests", async () => {
    forceMockMode();
    const serviceWrapper = new SlickTextServiceWrapper();

    const promises = Array.from({ length: 10 }, (_, i) =>
      serviceWrapper.sendMessage("list_123456789", `Concurrent message ${i}`)
    );

    const results = await Promise.all(promises);

    results.forEach((result) => {
      expect(result.success).toBe(true);
    });
  });

  test("should handle large batch operations", async () => {
    forceMockMode();
    const serviceWrapper = new SlickTextServiceWrapper();

    const promises = Array.from({ length: 50 }, (_, i) =>
      serviceWrapper.subscribeContact(
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
});

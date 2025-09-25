/**
 * Flying Fox Solutions - SlickText API v2 Mock Service
 *
 * Mock implementation of SlickText service for testing without hitting the live API.
 * All functions return realistic mock data that matches the real API v2 structure.
 */

import {
  mockLists,
  mockContacts,
  mockMessages,
  mockCampaigns,
  mockAutoReplies,
  mockAccountBalance,
  mockErrors,
  mockWebhookEvents,
  MockSlickTextContact,
  MockSlickTextMessage,
  MockSlickTextCampaign,
  MockSlickTextList,
  MockSlickTextAutoReply,
  MockSlickTextAccountBalance,
  generateMockContact,
  generateMockMessage,
  generateMockCampaign,
  findMockList,
  findMockContact,
  findMockMessage,
  findMockCampaign,
  findMockAutoReply,
} from "./slicktextMockData";

// ============================================================================
// Mock Response Interface
// ============================================================================

interface MockSlickTextResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// Mock Service Class
// ============================================================================

export class SlickTextMockService {
  private delayMs: number;

  constructor(delayMs: number = 100) {
    this.delayMs = delayMs;
  }

  /**
   * Simulate network delay for realistic testing
   */
  private async simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }

  /**
   * Mock: Send SMS message to a list
   */
  async mockSendMessage(
    listId: string,
    content: string,
    scheduledFor?: Date
  ): Promise<MockSlickTextResponse<MockSlickTextMessage>> {
    await this.simulateDelay();

    // Validate list exists
    const list = findMockList(listId);
    if (!list) {
      return {
        success: false,
        error: `List with ID ${listId} not found`,
      };
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: "Message content is required",
      };
    }

    if (content.length > 1600) {
      return {
        success: false,
        error: "Message content cannot exceed 1600 characters",
      };
    }

    // Generate mock message
    const mockMessage = generateMockMessage({
      content,
      list_id: listId,
      status: scheduledFor ? "queued" : "sent",
      scheduled_for: scheduledFor?.toISOString(),
    });

    return {
      success: true,
      data: mockMessage,
    };
  }

  /**
   * Mock: Get message history
   */
  async mockGetMessageHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<MockSlickTextResponse<MockSlickTextMessage[]>> {
    await this.simulateDelay();

    const paginatedMessages = mockMessages.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedMessages,
    };
  }

  /**
   * Mock: Subscribe a contact to a list
   */
  async mockSubscribeContact(
    listId: string,
    phoneNumber: string,
    customFields?: Record<string, string>
  ): Promise<MockSlickTextResponse<MockSlickTextContact>> {
    await this.simulateDelay();

    // Validate list exists
    const list = findMockList(listId);
    if (!list) {
      return {
        success: false,
        error: `List with ID ${listId} not found`,
      };
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return {
        success: false,
        error: "Phone number is required",
      };
    }

    // Check if contact already exists
    const existingContact = mockContacts.find(
      (contact) => contact.phone === phoneNumber && contact.list_id === listId
    );

    if (existingContact) {
      return {
        success: false,
        error: "Contact already exists in this list",
      };
    }

    // Generate mock contact
    const mockContact = generateMockContact({
      phone: phoneNumber,
      list_id: listId,
      first_name: customFields?.firstName || customFields?.first_name,
      last_name: customFields?.lastName || customFields?.last_name,
      email: customFields?.email,
    });

    return {
      success: true,
      data: mockContact,
    };
  }

  /**
   * Mock: Get contacts from a list
   */
  async mockGetContacts(
    limit: number = 50,
    offset: number = 0,
    tags?: string[]
  ): Promise<MockSlickTextResponse<MockSlickTextContact[]>> {
    await this.simulateDelay();

    let filteredContacts = mockContacts;

    // Apply tag filtering if provided
    if (tags && tags.length > 0) {
      // In a real implementation, you'd filter by tags
      // For mock purposes, we'll just return all contacts
      filteredContacts = mockContacts;
    }

    const paginatedContacts = filteredContacts.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedContacts,
    };
  }

  /**
   * Mock: Get campaign statistics
   */
  async mockGetCampaignStats(
    campaignId: string
  ): Promise<MockSlickTextResponse<MockSlickTextCampaign>> {
    await this.simulateDelay();

    const campaign = findMockCampaign(campaignId);
    if (!campaign) {
      return {
        success: false,
        error: `Campaign with ID ${campaignId} not found`,
      };
    }

    return {
      success: true,
      data: campaign,
    };
  }

  /**
   * Mock: Get all lists
   */
  async mockGetLists(): Promise<MockSlickTextResponse<MockSlickTextList[]>> {
    await this.simulateDelay();

    return {
      success: true,
      data: mockLists,
    };
  }

  /**
   * Mock: Delete a subscriber
   */
  async mockDeleteSubscriber(
    subscriberId: string
  ): Promise<MockSlickTextResponse<{ id: string; status: string }>> {
    await this.simulateDelay();

    const contact = findMockContact(subscriberId);
    if (!contact) {
      return {
        success: false,
        error: `Subscriber with ID ${subscriberId} not found`,
      };
    }

    return {
      success: true,
      data: {
        id: subscriberId,
        status: "deleted",
      },
    };
  }

  /**
   * Mock: Get auto-replies
   */
  async mockGetAutoReplies(): Promise<
    MockSlickTextResponse<MockSlickTextAutoReply[]>
  > {
    await this.simulateDelay();

    return {
      success: true,
      data: mockAutoReplies,
    };
  }

  /**
   * Mock: Create auto-reply
   */
  async mockCreateAutoReply(
    keyword: string,
    message: string,
    isActive: boolean = true
  ): Promise<MockSlickTextResponse<MockSlickTextAutoReply>> {
    await this.simulateDelay();

    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      return {
        success: false,
        error: "Keyword is required",
      };
    }

    // Validate message
    if (!message || message.trim().length === 0) {
      return {
        success: false,
        error: "Message is required",
      };
    }

    // Check if keyword already exists
    const existingReply = mockAutoReplies.find(
      (reply) => reply.keyword === keyword
    );
    if (existingReply) {
      return {
        success: false,
        error: "Auto-reply with this keyword already exists",
      };
    }

    const mockAutoReply: MockSlickTextAutoReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      keyword,
      message,
      is_active: isActive,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockAutoReply,
    };
  }

  /**
   * Mock: Verify webhook signature (always returns true for testing)
   */
  async mockVerifyWebhook(): Promise<boolean> {
    await this.simulateDelay();
    return true;
  }

  /**
   * Mock: Process webhook event
   */
  async mockProcessWebhook(
    payload: unknown
  ): Promise<MockSlickTextResponse<{ status: string; event_id: string }>> {
    await this.simulateDelay();

    const eventData = payload as Record<string, unknown>;

    // Simulate processing different event types
    switch (eventData.type) {
      case "message.delivered":
      case "message.failed":
      case "subscriber.opted_out":
      case "subscriber.opted_in":
        return {
          success: true,
          data: {
            status: "processed",
            event_id: (eventData.id as string) || "unknown",
          },
        };
      default:
        return {
          success: false,
          error: "Unknown webhook event type",
        };
    }
  }

  /**
   * Mock: Get account balance
   */
  async mockGetAccountBalance(): Promise<
    MockSlickTextResponse<MockSlickTextAccountBalance>
  > {
    await this.simulateDelay();

    return {
      success: true,
      data: mockAccountBalance,
    };
  }

  /**
   * Mock: Generate error response for testing error handling
   */
  async mockGenerateError(
    errorType: keyof typeof mockErrors
  ): Promise<MockSlickTextResponse<never>> {
    await this.simulateDelay();

    const error = mockErrors[errorType];
    return {
      success: false,
      error: error.error,
    };
  }

  /**
   * Mock: Get webhook event examples
   */
  async mockGetWebhookEvents(): Promise<
    MockSlickTextResponse<typeof mockWebhookEvents>
  > {
    await this.simulateDelay();

    return {
      success: true,
      data: mockWebhookEvents,
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const slickTextMockService = new SlickTextMockService();

// ============================================================================
// Convenience Functions for Testing
// ============================================================================

export const mockSendMessage =
  slickTextMockService.mockSendMessage.bind(slickTextMockService);
export const mockSubscribeContact =
  slickTextMockService.mockSubscribeContact.bind(slickTextMockService);
export const mockGetCampaignStats =
  slickTextMockService.mockGetCampaignStats.bind(slickTextMockService);
export const mockGetLists =
  slickTextMockService.mockGetLists.bind(slickTextMockService);
export const mockDeleteSubscriber =
  slickTextMockService.mockDeleteSubscriber.bind(slickTextMockService);
export const mockGetMessageHistory =
  slickTextMockService.mockGetMessageHistory.bind(slickTextMockService);
export const mockGetContacts =
  slickTextMockService.mockGetContacts.bind(slickTextMockService);
export const mockGetAutoReplies =
  slickTextMockService.mockGetAutoReplies.bind(slickTextMockService);
export const mockCreateAutoReply =
  slickTextMockService.mockCreateAutoReply.bind(slickTextMockService);
export const mockVerifyWebhook =
  slickTextMockService.mockVerifyWebhook.bind(slickTextMockService);
export const mockProcessWebhook =
  slickTextMockService.mockProcessWebhook.bind(slickTextMockService);
export const mockGetAccountBalance =
  slickTextMockService.mockGetAccountBalance.bind(slickTextMockService);
export const mockGenerateError =
  slickTextMockService.mockGenerateError.bind(slickTextMockService);
export const mockGetWebhookEvents =
  slickTextMockService.mockGetWebhookEvents.bind(slickTextMockService);

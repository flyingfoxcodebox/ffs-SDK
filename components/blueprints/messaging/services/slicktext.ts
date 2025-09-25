/**
 * SlickText API v2 Service Adapter
 * --------------------------------
 * Abstraction layer for SlickText SMS API v2 integration
 * This service can be easily swapped for other SMS providers
 */

import type {
  SlickTextConfig,
  SlickTextResponse,
  SendMessageRequest,
  SendMessageResponse,
  Contact,
  Campaign,
  Message,
  AutoReply,
  SlickTextWebhook,
} from "../types";

// ✅ SMS Character Limits
const SMS_LIMITS = {
  GSM_7BIT: 160,
  GSM_7BIT_CONCAT: 153,
  UNICODE: 70,
  UNICODE_CONCAT: 67,
} as const;

// ✅ SMS Pricing (example rates - adjust based on your SlickText plan)
const SMS_PRICING = {
  GSM_7BIT: 0.0075, // $0.0075 per SMS
  UNICODE: 0.015, // $0.015 per SMS (typically double)
} as const;

// ✅ SlickText API v2 Types
interface SlickTextApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface SlickTextContact {
  id: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  custom_fields?: Record<string, string>;
  is_opted_in: boolean;
  created_at: string;
  updated_at: string;
}

interface SlickTextList {
  id: string;
  name: string;
  description?: string;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

interface SlickTextMessage {
  id: string;
  content: string;
  list_id: string;
  contact_count: number;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export class SlickTextService {
  private config: SlickTextConfig;

  constructor(config: SlickTextConfig) {
    this.config = config;
  }

  /**
   * Update SlickText configuration
   */
  updateConfig(config: Partial<SlickTextConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SlickTextConfig {
    return this.config;
  }

  /**
   * Calculate message segments and cost
   */
  calculateMessageSegments(content: string): {
    segments: Array<{
      content: string;
      characterCount: number;
      isUnicode: boolean;
    }>;
    totalCost: number;
    totalCharacters: number;
  } {
    const isUnicode = this.containsUnicode(content);
    const maxLength = isUnicode ? SMS_LIMITS.UNICODE : SMS_LIMITS.GSM_7BIT;
    const concatLength = isUnicode
      ? SMS_LIMITS.UNICODE_CONCAT
      : SMS_LIMITS.GSM_7BIT_CONCAT;

    const segments: Array<{
      content: string;
      characterCount: number;
      isUnicode: boolean;
    }> = [];
    const totalCharacters = content.length;

    if (totalCharacters <= maxLength) {
      // Single segment
      segments.push({
        content,
        characterCount: totalCharacters,
        isUnicode,
      });
    } else {
      // Multiple segments
      let remaining = content;
      while (remaining.length > 0) {
        const segmentLength = segments.length === 0 ? maxLength : concatLength;
        const segment = remaining.substring(0, segmentLength);
        segments.push({
          content: segment,
          characterCount: segment.length,
          isUnicode,
        });
        remaining = remaining.substring(segmentLength);
      }
    }

    const totalCost =
      segments.length *
      (isUnicode ? SMS_PRICING.UNICODE : SMS_PRICING.GSM_7BIT);

    return {
      segments,
      totalCost,
      totalCharacters,
    };
  }

  /**
   * Subscribe a contact to a list
   */
  async subscribeContact(
    listId: string,
    phoneNumber: string,
    customFields?: Record<string, string>
  ): Promise<SlickTextResponse<Contact>> {
    try {
      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists/${listId}/subscribers`,
        {
          method: "POST",
          body: JSON.stringify({
            phone_number: phoneNumber,
            custom_fields: customFields || {},
          }),
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to subscribe contact",
        };
      }

      // Convert SlickText contact to our Contact type
      const contact: Contact = {
        id: response.data.id,
        phoneNumber: response.data.phone_number,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        email: response.data.email,
        tags: [], // Map custom fields to tags if needed
        isOptedIn: response.data.is_opted_in,
        createdAt: response.data.created_at,
      };

      return {
        success: true,
        data: contact,
      };
    } catch (error) {
      console.error("SlickText subscribeContact error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Send SMS message
   */
  async sendMessage(
    request: SendMessageRequest
  ): Promise<SlickTextResponse<SendMessageResponse>> {
    try {
      // For API v2, we need to send to a list rather than individual recipients
      // This is a simplified version - in practice, you'd need to handle list creation/management
      const listId = this.config.accountId; // Using accountId as listId for simplicity

      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists/${listId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: request.message,
            scheduled_at: request.scheduledAt,
          }),
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to send message",
        };
      }

      return {
        success: true,
        data: {
          campaignId: response.data.id,
          messageId: response.data.id,
          recipientCount: response.data.contact_count || 0,
          estimatedCost: this.calculateMessageSegments(request.message)
            .totalCost,
          scheduledAt: response.data.scheduled_at,
        },
      };
    } catch (error) {
      console.error("SlickText sendMessage error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get message history/campaigns
   */
  async getMessageHistory(
    limit = 50,
    offset = 0
  ): Promise<SlickTextResponse<Campaign[]>> {
    try {
      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists/${this.config.accountId}/messages?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to fetch message history",
        };
      }

      const campaigns: Campaign[] = (response.data.messages || []).map(
        (message: SlickTextMessage) => ({
          id: message.id,
          name: `Campaign ${message.id}`,
          message: {
            id: message.id,
            content: message.content,
            segments: this.calculateMessageSegments(
              message.content
            ).segments.map((segment, index) => ({
              id: `${message.id}-${index}`,
              content: segment.content,
              characterCount: segment.characterCount,
              isUnicode: segment.isUnicode,
              estimatedCost: segment.isUnicode
                ? SMS_PRICING.UNICODE
                : SMS_PRICING.GSM_7BIT,
            })),
            recipientCount: message.contact_count,
            status: message.status,
            createdAt: message.created_at,
            scheduledAt: message.scheduled_at,
            sentAt: message.sent_at,
            cost: this.calculateMessageSegments(message.content).totalCost,
            currency: "USD",
          },
          recipients: [], // Would need separate call to get recipients
          status: message.status,
          scheduledAt: message.scheduled_at,
          sentAt: message.sent_at,
          deliveryStats: {
            totalSent: message.contact_count,
            delivered: 0, // Would need separate call to get delivery stats
            failed: 0,
            pending: 0,
            deliveryRate: 0,
            cost: this.calculateMessageSegments(message.content).totalCost,
            currency: "USD",
          },
          createdAt: message.created_at,
          updatedAt: message.updated_at,
        })
      );

      return {
        success: true,
        data: campaigns,
      };
    } catch (error) {
      console.error("SlickText getMessageHistory error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get contacts/subscribers
   */
  async getContacts(
    limit = 100,
    offset = 0
  ): Promise<SlickTextResponse<Contact[]>> {
    try {
      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists/${this.config.accountId}/subscribers?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to fetch contacts",
        };
      }

      const contacts: Contact[] = (response.data.subscribers || []).map(
        (subscriber: SlickTextContact) => ({
          id: subscriber.id,
          phoneNumber: subscriber.phone_number,
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
          email: subscriber.email,
          tags: [], // Map custom fields to tags if needed
          isOptedIn: subscriber.is_opted_in,
          createdAt: subscriber.created_at,
          lastContacted: subscriber.updated_at,
        })
      );

      return {
        success: true,
        data: contacts,
      };
    } catch (error) {
      console.error("SlickText getContacts error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Upload contacts
   */
  async uploadContacts(
    contacts: Contact[]
  ): Promise<SlickTextResponse<{ successCount: number; errorCount: number }>> {
    try {
      const listId = this.config.accountId; // Using accountId as listId for simplicity
      let successCount = 0;
      let errorCount = 0;

      // Upload contacts one by one (or in batches if SlickText supports it)
      for (const contact of contacts) {
        const result = await this.subscribeContact(
          listId,
          contact.phoneNumber,
          {
            first_name: contact.firstName || "",
            last_name: contact.lastName || "",
            email: contact.email || "",
          }
        );

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      return {
        success: true,
        data: {
          successCount,
          errorCount,
        },
      };
    } catch (error) {
      console.error("SlickText uploadContacts error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get lists
   */
  async getLists(): Promise<SlickTextResponse<SlickTextList[]>> {
    try {
      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists`,
        {
          method: "GET",
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to fetch lists",
        };
      }

      return {
        success: true,
        data: response.data.lists || [],
      };
    } catch (error) {
      console.error("SlickText getLists error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete a subscriber
   */
  async deleteSubscriber(
    listId: string,
    subscriberId: string
  ): Promise<SlickTextResponse<boolean>> {
    try {
      const response = await this.makeApiCall(
        `/brands/${this.config.accountId}/lists/${listId}/subscribers/${subscriberId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to delete subscriber",
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error("SlickText deleteSubscriber error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get auto-replies (placeholder - API v2 may not support this)
   */
  async getAutoReplies(): Promise<SlickTextResponse<AutoReply[]>> {
    try {
      // API v2 may not support auto-replies in the same way
      // This is a placeholder implementation
      console.warn("Auto-replies may not be supported in SlickText API v2");

      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("SlickText getAutoReplies error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Create auto-reply (placeholder - API v2 may not support this)
   */
  async createAutoReply(
    keyword: string,
    message: string
  ): Promise<SlickTextResponse<AutoReply>> {
    try {
      // API v2 may not support auto-replies in the same way
      // This is a placeholder implementation
      console.warn("Auto-replies may not be supported in SlickText API v2");

      const autoReply: AutoReply = {
        id: `autoreply_${Date.now()}`,
        keyword,
        message,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        triggerCount: 0,
      };

      return {
        success: true,
        data: autoReply,
      };
    } catch (error) {
      console.error("SlickText createAutoReply error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhook(payload: string, signature: string): boolean {
    // Implement webhook signature validation for API v2
    // This is a placeholder - implement based on SlickText's v2 webhook validation
    return true;
  }

  /**
   * Process webhook
   */
  async processWebhook(webhook: SlickTextWebhook): Promise<void> {
    try {
      // Process webhook events for API v2
      switch (webhook.event) {
        case "message.sent":
          console.log("Message sent:", webhook.data);
          break;
        case "message.delivered":
          console.log("Message delivered:", webhook.data);
          break;
        case "message.failed":
          console.log("Message failed:", webhook.data);
          break;
        case "contact.opted_in":
          console.log("Contact opted in:", webhook.data);
          break;
        case "contact.opted_out":
          console.log("Contact opted out:", webhook.data);
          break;
        default:
          console.log("Unknown webhook event:", webhook.event);
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  /**
   * Make API call to SlickText API v2
   */
  private async makeApiCall(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SlickTextApiResponse> {
    const url = `${this.config.baseUrl}${endpoint}`;

    // Create Basic Auth header with public_key:private_key for API v2
    const credentials = btoa(`${this.config.apiKey}:${this.config.accountId}`);

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
      "User-Agent": "FlyingFox-Solutions/1.0",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  }

  /**
   * Check if text contains Unicode characters
   */
  private containsUnicode(text: string): boolean {
    // Simple Unicode detection - can be enhanced
    return /[^\u0000-\u007F]/.test(text);
  }
}

// ✅ Export singleton instance with API v2 configuration
export const slickTextService = new SlickTextService({
  apiKey: "",
  accountId: "",
  baseUrl: "https://dev.slicktext.com/v1",
  sandboxMode: true,
});

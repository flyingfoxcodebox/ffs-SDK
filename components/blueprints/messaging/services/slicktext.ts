/**
 * SlickText API Service Adapter
 * ----------------------------
 * Abstraction layer for SlickText SMS API integration
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
   * Send SMS message
   */
  async sendMessage(
    request: SendMessageRequest
  ): Promise<SlickTextResponse<SendMessageResponse>> {
    try {
      const response = await this.makeApiCall("/messages/send", {
        method: "POST",
        body: JSON.stringify({
          message: request.message,
          recipients: request.recipients,
          scheduled_at: request.scheduledAt,
          campaign_name: request.campaignName || `Campaign ${Date.now()}`,
        }),
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to send message",
        };
      }

      return {
        success: true,
        data: {
          campaignId: response.data.campaign_id,
          messageId: response.data.message_id,
          recipientCount: response.data.recipient_count,
          estimatedCost: response.data.estimated_cost,
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
        `/campaigns?limit=${limit}&offset=${offset}`,
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

      const campaigns: Campaign[] = response.data.campaigns.map(
        (campaign: any) => ({
          id: campaign.id,
          name: campaign.name,
          message: {
            id: campaign.message_id,
            content: campaign.message_content,
            segments: campaign.segments || [],
            recipientCount: campaign.recipient_count,
            status: campaign.status,
            createdAt: campaign.created_at,
            scheduledAt: campaign.scheduled_at,
            sentAt: campaign.sent_at,
            cost: campaign.cost,
            currency: campaign.currency || "USD",
          },
          recipients: campaign.recipients || [],
          status: campaign.status,
          scheduledAt: campaign.scheduled_at,
          sentAt: campaign.sent_at,
          deliveryStats: {
            totalSent: campaign.delivery_stats?.total_sent || 0,
            delivered: campaign.delivery_stats?.delivered || 0,
            failed: campaign.delivery_stats?.failed || 0,
            pending: campaign.delivery_stats?.pending || 0,
            deliveryRate: campaign.delivery_stats?.delivery_rate || 0,
            cost: campaign.delivery_stats?.cost || 0,
            currency: campaign.delivery_stats?.currency || "USD",
          },
          createdAt: campaign.created_at,
          updatedAt: campaign.updated_at,
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
   * Get contacts
   */
  async getContacts(
    limit = 100,
    offset = 0
  ): Promise<SlickTextResponse<Contact[]>> {
    try {
      const response = await this.makeApiCall(
        `/contacts?limit=${limit}&offset=${offset}`,
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

      const contacts: Contact[] = response.data.contacts.map(
        (contact: any) => ({
          id: contact.id,
          phoneNumber: contact.phone_number,
          firstName: contact.first_name,
          lastName: contact.last_name,
          email: contact.email,
          tags: contact.tags || [],
          isOptedIn: contact.is_opted_in,
          createdAt: contact.created_at,
          lastContacted: contact.last_contacted,
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
      const response = await this.makeApiCall("/contacts/upload", {
        method: "POST",
        body: JSON.stringify({
          contacts: contacts.map((contact) => ({
            phone_number: contact.phoneNumber,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            tags: contact.tags,
          })),
        }),
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to upload contacts",
        };
      }

      return {
        success: true,
        data: {
          successCount: response.data.success_count,
          errorCount: response.data.error_count,
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
   * Get auto-replies
   */
  async getAutoReplies(): Promise<SlickTextResponse<AutoReply[]>> {
    try {
      const response = await this.makeApiCall("/auto-replies", {
        method: "GET",
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to fetch auto-replies",
        };
      }

      const autoReplies: AutoReply[] = response.data.auto_replies.map(
        (reply: any) => ({
          id: reply.id,
          keyword: reply.keyword,
          message: reply.message,
          isActive: reply.is_active,
          createdAt: reply.created_at,
          updatedAt: reply.updated_at,
          triggerCount: reply.trigger_count || 0,
        })
      );

      return {
        success: true,
        data: autoReplies,
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
   * Create auto-reply
   */
  async createAutoReply(
    keyword: string,
    message: string
  ): Promise<SlickTextResponse<AutoReply>> {
    try {
      const response = await this.makeApiCall("/auto-replies", {
        method: "POST",
        body: JSON.stringify({
          keyword,
          message,
        }),
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to create auto-reply",
        };
      }

      const autoReply: AutoReply = {
        id: response.data.id,
        keyword: response.data.keyword,
        message: response.data.message,
        isActive: response.data.is_active,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
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
    // Implement webhook signature validation
    // This is a placeholder - implement based on SlickText's webhook validation
    return true;
  }

  /**
   * Process webhook
   */
  async processWebhook(webhook: SlickTextWebhook): Promise<void> {
    try {
      // Process webhook events
      switch (webhook.event) {
        case "message.sent":
          // Handle message sent event
          console.log("Message sent:", webhook.data);
          break;
        case "message.delivered":
          // Handle message delivered event
          console.log("Message delivered:", webhook.data);
          break;
        case "message.failed":
          // Handle message failed event
          console.log("Message failed:", webhook.data);
          break;
        case "contact.opted_in":
          // Handle contact opted in event
          console.log("Contact opted in:", webhook.data);
          break;
        case "contact.opted_out":
          // Handle contact opted out event
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
   * Make API call to SlickText
   */
  private async makeApiCall(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "X-Account-ID": this.config.accountId,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Check if text contains Unicode characters
   */
  private containsUnicode(text: string): boolean {
    // Simple Unicode detection - can be enhanced
    return /[^\u0000-\u007F]/.test(text);
  }
}

// ✅ Export singleton instance
export const slickTextService = new SlickTextService({
  apiKey: "",
  accountId: "",
  baseUrl: "https://api.slicktext.com/v1",
  sandboxMode: true,
});

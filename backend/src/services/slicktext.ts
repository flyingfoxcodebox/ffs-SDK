/**
 * Flying Fox Solutions - Backend API Boilerplate
 * SlickText API v2 Service
 */

import { logger } from "../middleware/logging";

// ============================================================================
// Types
// ============================================================================

interface SlickTextConfig {
  publicKey: string;
  privateKey: string;
  brandId: string;
  baseUrl: string;
  sandboxMode: boolean;
}

interface SlickTextResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SlickTextContact {
  id: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  list_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface SlickTextMessage {
  id: string;
  content: string;
  list_id: string;
  status: "queued" | "sent" | "delivered" | "failed";
  scheduled_for?: string;
  created_at: string;
}

interface SlickTextCampaign {
  id: string;
  name: string;
  content: string;
  list_id: string;
  status: "draft" | "scheduled" | "sent" | "completed";
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  created_at: string;
  sent_at?: string;
}

interface SlickTextList {
  id: string;
  name: string;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

interface SlickTextAutoReply {
  id: string;
  keyword: string;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SlickTextAccountBalance {
  balance: number;
  currency: string;
  last_updated: string;
}

// ============================================================================
// SlickText Service
// ============================================================================

export class SlickTextService {
  private config: SlickTextConfig | null = null;

  /**
   * Configure the SlickText service
   */
  configure(config: SlickTextConfig): void {
    this.config = config;
    logger.info("SlickText service configured", {
      baseUrl: config.baseUrl,
      sandboxMode: config.sandboxMode,
      brandId: config.brandId,
    });
  }

  /**
   * Make authenticated API call to SlickText
   */
  private async makeApiCall(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: Record<string, unknown>
  ): Promise<{ data: unknown; status: number }> {
    if (!this.config) {
      throw new Error("SlickText service not configured");
    }

    const url = `${this.config.baseUrl}${endpoint}`;

    // Create HTTP Basic Auth header
    const auth = Buffer.from(
      `${this.config.publicKey}:${this.config.privateKey}`
    ).toString("base64");

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "User-Agent": "FlyingFox-Solutions/1.0",
      },
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          (responseData as Record<string, unknown>).message || "Unknown error";
        throw new Error(
          `SlickText API error: ${response.status} - ${errorMessage}`
        );
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      logger.error(
        "SlickText API call failed:",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Send SMS message to a list
   */
  async sendMessage(
    listId: string,
    content: string,
    scheduledFor?: Date
  ): Promise<SlickTextResponse<SlickTextMessage>> {
    try {
      const payload: Record<string, unknown> = {
        list_id: listId,
        content: content,
      };

      if (scheduledFor) {
        payload.scheduled_for = scheduledFor.toISOString();
      }

      const response = await this.makeApiCall("/messages", "POST", payload);

      return {
        success: true,
        data: response.data as SlickTextMessage,
      };
    } catch (error) {
      logger.error(
        "SlickText sendMessage error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get message history
   */
  async getMessageHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<SlickTextResponse<SlickTextMessage[]>> {
    try {
      const response = await this.makeApiCall(
        `/messages?limit=${limit}&offset=${offset}`,
        "GET"
      );

      return {
        success: true,
        data: response.data as SlickTextMessage[],
      };
    } catch (error) {
      logger.error(
        "SlickText getMessageHistory error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Subscribe a contact to a list
   */
  async subscribeContact(
    listId: string,
    phoneNumber: string,
    customFields?: Record<string, string>
  ): Promise<SlickTextResponse<SlickTextContact>> {
    try {
      const payload = {
        phone: phoneNumber,
        list_id: listId,
        ...customFields,
      };

      const response = await this.makeApiCall("/subscribers", "POST", payload);

      return {
        success: true,
        data: response.data as SlickTextContact,
      };
    } catch (error) {
      logger.error(
        "SlickText subscribeContact error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get contacts from a list
   */
  async getContacts(
    limit: number = 50,
    offset: number = 0,
    tags?: string[]
  ): Promise<SlickTextResponse<SlickTextContact[]>> {
    try {
      let endpoint = `/contacts?limit=${limit}&offset=${offset}`;
      if (tags && tags.length > 0) {
        endpoint += `&tags=${tags.join(",")}`;
      }

      const response = await this.makeApiCall(endpoint, "GET");

      return {
        success: true,
        data: response.data as SlickTextContact[],
      };
    } catch (error) {
      logger.error(
        "SlickText getContacts error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get campaigns
   */
  async getCampaigns(): Promise<SlickTextResponse<SlickTextCampaign[]>> {
    try {
      const response = await this.makeApiCall("/campaigns", "GET");

      return {
        success: true,
        data: response.data as SlickTextCampaign[],
      };
    } catch (error) {
      logger.error(
        "SlickText getCampaigns error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(
    campaignId: string
  ): Promise<SlickTextResponse<SlickTextCampaign>> {
    try {
      const response = await this.makeApiCall(
        `/campaigns/${campaignId}/stats`,
        "GET"
      );

      return {
        success: true,
        data: response.data as SlickTextCampaign,
      };
    } catch (error) {
      logger.error(
        "SlickText getCampaignStats error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get all lists
   */
  async getLists(): Promise<SlickTextResponse<SlickTextList[]>> {
    try {
      const response = await this.makeApiCall("/lists", "GET");

      return {
        success: true,
        data: response.data as SlickTextList[],
      };
    } catch (error) {
      logger.error(
        "SlickText getLists error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete a subscriber
   */
  async deleteSubscriber(
    subscriberId: string
  ): Promise<SlickTextResponse<{ id: string; status: string }>> {
    try {
      const response = await this.makeApiCall(
        `/subscribers/${subscriberId}`,
        "DELETE"
      );

      return {
        success: true,
        data: response.data as { id: string; status: string },
      };
    } catch (error) {
      logger.error(
        "SlickText deleteSubscriber error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get auto-replies
   */
  async getAutoReplies(): Promise<SlickTextResponse<SlickTextAutoReply[]>> {
    try {
      const response = await this.makeApiCall("/auto-replies", "GET");

      return {
        success: true,
        data: response.data as SlickTextAutoReply[],
      };
    } catch (error) {
      logger.error(
        "SlickText getAutoReplies error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Create auto-reply
   */
  async createAutoReply(
    keyword: string,
    message: string,
    isActive: boolean = true
  ): Promise<SlickTextResponse<SlickTextAutoReply>> {
    try {
      const payload = {
        keyword,
        message,
        is_active: isActive,
      };

      const response = await this.makeApiCall("/auto-replies", "POST", payload);

      return {
        success: true,
        data: response.data as SlickTextAutoReply,
      };
    } catch (error) {
      logger.error(
        "SlickText createAutoReply error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // TODO: Implement webhook signature verification for API v2
    // This would typically involve HMAC-SHA256 verification
    logger.info("Webhook verification not implemented for API v2");
    return true;
  }

  /**
   * Process webhook event
   */
  async processWebhook(
    payload: unknown
  ): Promise<SlickTextResponse<{ status: string; event_id: string }>> {
    try {
      const eventData = payload as Record<string, unknown>;

      logger.info("SlickText webhook event processed:", {
        event_type: eventData.type,
        event_id: eventData.id,
        timestamp: new Date().toISOString(),
      });

      // Process different event types
      switch (eventData.type) {
        case "message.delivered":
          logger.info(
            "Message delivered:",
            eventData as Record<string, unknown>
          );
          break;
        case "message.failed":
          logger.info("Message failed:", eventData as Record<string, unknown>);
          break;
        case "subscriber.opted_out":
          logger.info(
            "Subscriber opted out:",
            eventData as Record<string, unknown>
          );
          break;
        case "subscriber.opted_in":
          logger.info(
            "Subscriber opted in:",
            eventData as Record<string, unknown>
          );
          break;
        default:
          logger.info("Unknown webhook event type:", { type: eventData.type });
      }

      return {
        success: true,
        data: {
          status: "processed",
          event_id: eventData.id as string,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const payloadData = payload as Record<string, unknown>;
      logger.error(
        "SlickText webhook processing failed:",
        error instanceof Error ? error : new Error(errorMessage),
        {
          eventType: payloadData.type,
          eventId: payloadData.id,
        }
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(): Promise<
    SlickTextResponse<SlickTextAccountBalance>
  > {
    try {
      const response = await this.makeApiCall("/account/balance", "GET");

      return {
        success: true,
        data: response.data as SlickTextAccountBalance,
      };
    } catch (error) {
      logger.error(
        "SlickText getAccountBalance error:",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const slicktextService = new SlickTextService();

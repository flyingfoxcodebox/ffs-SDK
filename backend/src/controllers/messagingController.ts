/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Messaging Controller
 */

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, SendSMSRequest } from "../types";
import { slicktextService } from "../services";
import {
  formatSuccessResponse,
  createValidationError,
  createNotFoundError,
  businessEventLogger,
  securityEventLogger,
} from "../utils";

// ============================================================================
// Messaging Controller
// ============================================================================

export class MessagingController {
  /**
   * Send SMS message via API v2
   */
  static async sendSMS(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { content, recipients, campaignName, listId, scheduledFor } =
        req.body as SendSMSRequest;

      // Validate message content
      if (!content || content.trim().length === 0) {
        throw createValidationError("Message content is required");
      }

      if (content.length > 1600) {
        throw createValidationError(
          "Message content cannot exceed 1600 characters"
        );
      }

      // Validate recipients or listId (API v2 requires list-based sending)
      if (
        !listId &&
        (!recipients || !Array.isArray(recipients) || recipients.length === 0)
      ) {
        throw createValidationError(
          "Either listId or recipients list is required"
        );
      }

      if (recipients && recipients.length > 1000) {
        throw createValidationError(
          "Cannot send to more than 1000 recipients at once"
        );
      }

      // Use listId for API v2, or create a temporary list if recipients provided
      const targetListId = listId || "default"; // In practice, you'd create a temporary list

      // Send SMS via SlickText API v2
      const sendResult = await slicktextService.sendMessage(
        targetListId,
        content,
        scheduledFor ? new Date(scheduledFor) : undefined
      );

      if (!sendResult.success) {
        throw createValidationError("Failed to send SMS message");
      }

      // Log SMS sending
      if (sendResult.data) {
        businessEventLogger("sms_sent", userId, {
          message_id: sendResult.data.id,
          list_id: targetListId,
          content_length: content.length,
          campaign_name: campaignName,
          scheduled_for: scheduledFor,
        });
      }

      const response = formatSuccessResponse(
        sendResult.data,
        "SMS message sent successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get campaign stats (API v2 equivalent of message status)
   */
  static async getCampaignStats(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { campaignId } = req.params;

      if (!campaignId) {
        throw createValidationError("Campaign ID is required");
      }

      // Get campaign stats from SlickText API v2
      const statsResult = await slicktextService.getCampaignStats(campaignId);
      if (!statsResult.success) {
        throw createNotFoundError("Campaign");
      }

      const response = formatSuccessResponse(
        statsResult.data,
        "Campaign stats retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get message history
   */
  static async getMessageHistory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get message history from SlickText
      const historyResult = await slicktextService.getMessageHistory(
        limit,
        offset
      );
      if (!historyResult.success) {
        throw createValidationError("Failed to retrieve message history");
      }

      const response = formatSuccessResponse(
        historyResult.data,
        "Message history retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Subscribe contact to list (API v2)
   */
  static async subscribeContact(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { listId, phone, firstName, lastName, email, customFields } =
        req.body;

      if (!listId || !phone) {
        throw createValidationError("List ID and phone number are required");
      }

      // Subscribe contact to SlickText list via API v2
      const subscribeResult = await slicktextService.subscribeContact(
        listId,
        phone,
        { firstName, lastName, email, ...customFields }
      );

      if (!subscribeResult.success) {
        throw createValidationError("Failed to subscribe contact");
      }

      // Log contact subscription
      if (subscribeResult.data) {
        businessEventLogger("contact_subscribed", userId, {
          list_id: listId,
          phone: phone,
          subscriber_id: subscribeResult.data.id,
        });
      }

      const response = formatSuccessResponse(
        subscribeResult.data,
        "Contact subscribed successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get contacts
   */
  static async getContacts(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const tags = req.query.tags
        ? (req.query.tags as string).split(",")
        : undefined;

      // Get contacts from SlickText
      const contactsResult = await slicktextService.getContacts(
        limit,
        offset,
        tags
      );
      if (!contactsResult.success) {
        throw createValidationError("Failed to retrieve contacts");
      }

      const response = formatSuccessResponse(
        contactsResult.data,
        "Contacts retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lists (API v2)
   */
  static async getLists(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // Get lists from SlickText API v2
      const listsResult = await slicktextService.getLists();
      if (!listsResult.success) {
        throw createValidationError("Failed to retrieve lists");
      }

      const response = formatSuccessResponse(
        listsResult.data,
        "Lists retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete subscriber (API v2)
   */
  static async deleteSubscriber(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { subscriberId } = req.params;

      if (!subscriberId) {
        throw createValidationError("Subscriber ID is required");
      }

      // Delete subscriber from SlickText API v2
      const deleteResult = await slicktextService.deleteSubscriber(
        subscriberId
      );
      if (!deleteResult.success) {
        throw createValidationError("Failed to delete subscriber");
      }

      // Log subscriber deletion
      businessEventLogger("subscriber_deleted", userId, {
        subscriber_id: subscriberId,
      });

      const response = formatSuccessResponse(
        deleteResult.data,
        "Subscriber deleted successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get campaigns
   */
  static async getCampaigns(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get campaigns from SlickText
      const campaignsResult = await slicktextService.getCampaigns();
      if (!campaignsResult.success) {
        throw createValidationError("Failed to retrieve campaigns");
      }

      const response = formatSuccessResponse(
        campaignsResult.data,
        "Campaigns retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create auto-reply
   */
  static async createAutoReply(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { keyword, message, isActive } = req.body;

      if (!keyword || !message) {
        throw createValidationError("Keyword and message are required");
      }

      // Create auto-reply in SlickText
      const autoReplyResult = await slicktextService.createAutoReply(
        keyword,
        message,
        isActive !== false // Default to true
      );

      if (!autoReplyResult.success) {
        throw createValidationError("Failed to create auto-reply");
      }

      // Log auto-reply creation
      if (autoReplyResult.data) {
        businessEventLogger("auto_reply_created", userId, {
          auto_reply_id: autoReplyResult.data.id,
          keyword: keyword,
          is_active: autoReplyResult.data.is_active,
        });
      }

      const response = formatSuccessResponse(
        autoReplyResult.data,
        "Auto-reply created successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get auto-replies
   */
  static async getAutoReplies(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // Get auto-replies from SlickText
      const autoRepliesResult = await slicktextService.getAutoReplies();
      if (!autoRepliesResult.success) {
        throw createValidationError("Failed to retrieve auto-replies");
      }

      const response = formatSuccessResponse(
        autoRepliesResult.data,
        "Auto-replies retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get account balance
   */
  static async getAccountBalance(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // Get account balance from SlickText
      const balanceResult = await slicktextService.getAccountBalance();
      if (!balanceResult.success) {
        throw createValidationError("Failed to retrieve account balance");
      }

      const response = formatSuccessResponse(
        balanceResult.data,
        "Account balance retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle webhook events
   */
  static async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const signature = req.headers["x-slicktext-signature"] as string;
      const payload = JSON.stringify(req.body);

      // Verify webhook signature
      const isValid = await slicktextService.verifyWebhook(payload, signature);
      if (!isValid) {
        securityEventLogger(
          "webhook_verification_failed",
          "high",
          undefined,
          req.ip,
          {
            service: "slicktext",
          }
        );
        throw createValidationError("Invalid webhook signature");
      }

      // Process webhook event
      const processResult = await slicktextService.processWebhook(req.body);
      if (!processResult.success) {
        throw createValidationError("Failed to process webhook");
      }

      // Log webhook processing
      businessEventLogger("webhook_processed", undefined, {
        service: "slicktext",
        event_type: req.body.type,
        event_id: req.body.id,
      });

      const response = formatSuccessResponse(
        processResult.data,
        "Webhook processed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

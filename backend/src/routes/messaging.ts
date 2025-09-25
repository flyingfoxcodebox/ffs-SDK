/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Messaging Routes (SlickText API v2)
 */

import { Router } from "express";
import { MessagingController } from "../controllers";
import { validateSendSMS, validateRequired, wrapAsync } from "../middleware";

const router = Router();

// ============================================================================
// Protected Routes (API v2)
// ============================================================================

/**
 * @route   POST /api/messaging/send
 * @desc    Send SMS message via SlickText API v2
 * @access  Private
 */
router.post(
  "/send",
  // TODO: Add authentication middleware
  validateSendSMS,
  wrapAsync(MessagingController.sendSMS)
);

/**
 * @route   GET /api/messaging/campaigns/:campaignId/stats
 * @desc    Get campaign statistics (API v2 equivalent of message status)
 * @access  Private
 */
router.get(
  "/campaigns/:campaignId/stats",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getCampaignStats)
);

/**
 * @route   GET /api/messaging/messages/history
 * @desc    Get message history
 * @access  Private
 */
router.get(
  "/messages/history",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getMessageHistory)
);

/**
 * @route   GET /api/messaging/lists
 * @desc    Get SlickText lists (API v2)
 * @access  Private
 */
router.get(
  "/lists",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getLists)
);

/**
 * @route   POST /api/messaging/contacts/subscribe
 * @desc    Subscribe contact to list (API v2)
 * @access  Private
 */
router.post(
  "/contacts/subscribe",
  // TODO: Add authentication middleware
  validateRequired(["listId", "phone"]),
  wrapAsync(MessagingController.subscribeContact)
);

/**
 * @route   GET /api/messaging/contacts
 * @desc    Get contacts
 * @access  Private
 */
router.get(
  "/contacts",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getContacts)
);

/**
 * @route   DELETE /api/messaging/contacts/:subscriberId
 * @desc    Delete subscriber from list (API v2)
 * @access  Private
 */
router.delete(
  "/contacts/:subscriberId",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.deleteSubscriber)
);

/**
 * @route   POST /api/messaging/auto-replies
 * @desc    Create auto-reply
 * @access  Private
 */
router.post(
  "/auto-replies",
  // TODO: Add authentication middleware
  validateRequired(["keyword", "message"]),
  wrapAsync(MessagingController.createAutoReply)
);

/**
 * @route   GET /api/messaging/auto-replies
 * @desc    Get auto-replies
 * @access  Private
 */
router.get(
  "/auto-replies",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getAutoReplies)
);

/**
 * @route   GET /api/messaging/account/balance
 * @desc    Get account balance
 * @access  Private
 */
router.get(
  "/account/balance",
  // TODO: Add authentication middleware
  wrapAsync(MessagingController.getAccountBalance)
);

// ============================================================================
// Webhook Routes
// ============================================================================

/**
 * @route   POST /api/messaging/webhooks/slicktext
 * @desc    Handle SlickText webhook events (API v2)
 * @access  Public (but verified via signature)
 */
router.post(
  "/webhooks/slicktext",
  wrapAsync(MessagingController.handleWebhook)
);

export default router;

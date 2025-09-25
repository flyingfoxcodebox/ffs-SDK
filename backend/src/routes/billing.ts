/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Billing Routes
 */

import { Router } from "express";
import { BillingController } from "../controllers";
import { validateCheckout, validateRequired, wrapAsync } from "../middleware";

const router = Router();

// ============================================================================
// Public Routes
// ============================================================================

/**
 * @route   GET /api/billing/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get("/plans", wrapAsync(BillingController.getPlans));

// ============================================================================
// Protected Routes
// ============================================================================

/**
 * @route   POST /api/billing/checkout
 * @desc    Process subscription checkout
 * @access  Private
 */
router.post(
  "/checkout",
  // TODO: Add authentication middleware
  validateCheckout,
  wrapAsync(BillingController.checkout)
);

/**
 * @route   GET /api/billing/subscription
 * @desc    Get user's current subscription
 * @access  Private
 */
router.get(
  "/subscription",
  // TODO: Add authentication middleware
  wrapAsync(BillingController.getSubscription)
);

/**
 * @route   PUT /api/billing/subscription
 * @desc    Update subscription
 * @access  Private
 */
router.put(
  "/subscription",
  // TODO: Add authentication middleware
  validateRequired(["planId"]),
  wrapAsync(BillingController.updateSubscription)
);

/**
 * @route   DELETE /api/billing/subscription/:subscriptionId
 * @desc    Cancel subscription
 * @access  Private
 */
router.delete(
  "/subscription/:subscriptionId",
  // TODO: Add authentication middleware
  wrapAsync(BillingController.cancelSubscription)
);

/**
 * @route   GET /api/billing/history
 * @desc    Get billing history
 * @access  Private
 */
router.get(
  "/history",
  // TODO: Add authentication middleware
  wrapAsync(BillingController.getBillingHistory)
);

/**
 * @route   GET /api/billing/payment-methods
 * @desc    Get user's payment methods
 * @access  Private
 */
router.get(
  "/payment-methods",
  // TODO: Add authentication middleware
  wrapAsync(BillingController.getPaymentMethods)
);

/**
 * @route   POST /api/billing/payment-methods
 * @desc    Add payment method
 * @access  Private
 */
router.post(
  "/payment-methods",
  // TODO: Add authentication middleware
  validateRequired(["paymentMethod"]),
  wrapAsync(BillingController.addPaymentMethod)
);

// ============================================================================
// Webhook Routes
// ============================================================================

/**
 * @route   POST /api/billing/webhooks/stripe
 * @desc    Handle Stripe webhook events
 * @access  Public (but verified via signature)
 */
router.post("/webhooks/stripe", wrapAsync(BillingController.handleWebhook));

export default router;

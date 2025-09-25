/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Billing Controller
 */

import { Request, Response, NextFunction } from "express";
import {
  AuthenticatedRequest,
  CheckoutRequest,
  SubscriptionPlan,
} from "../types";
import { stripeService } from "../services";
import {
  formatSuccessResponse,
  createValidationError,
  createNotFoundError,
  businessEventLogger,
  securityEventLogger,
} from "../utils";

// ============================================================================
// Billing Controller
// ============================================================================

export class BillingController {
  /**
   * Get available subscription plans
   */
  static async getPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Mock subscription plans - in production, these would come from a database
      const plans: SubscriptionPlan[] = [
        {
          id: "plan_basic",
          name: "Basic Plan",
          description: "Perfect for individuals and small teams",
          price: 9.99,
          currency: "USD",
          interval: "monthly",
          features: [
            "Up to 5 projects",
            "Basic support",
            "Standard templates",
            "Email notifications",
          ],
          isActive: true,
        },
        {
          id: "plan_pro",
          name: "Pro Plan",
          description: "Ideal for growing businesses",
          price: 29.99,
          currency: "USD",
          interval: "monthly",
          features: [
            "Unlimited projects",
            "Priority support",
            "Advanced templates",
            "Custom integrations",
            "Analytics dashboard",
          ],
          isPopular: true,
          isActive: true,
        },
        {
          id: "plan_enterprise",
          name: "Enterprise Plan",
          description: "For large organizations",
          price: 99.99,
          currency: "USD",
          interval: "monthly",
          features: [
            "Everything in Pro",
            "Dedicated support",
            "Custom development",
            "White-label options",
            "Advanced security",
            "SLA guarantee",
          ],
          isActive: true,
        },
      ];

      const response = formatSuccessResponse(
        plans,
        "Subscription plans retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process checkout
   */
  static async checkout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { planId, email, paymentMethod, customerInfo } =
        req.body as CheckoutRequest;

      // Validate plan exists
      const plansResponse = await BillingController.getPlans(
        req,
        res,
        () => {}
      );
      const plans = (plansResponse as any).data;
      const selectedPlan = plans.find(
        (plan: SubscriptionPlan) => plan.id === planId
      );

      if (!selectedPlan) {
        throw createNotFoundError("Subscription plan");
      }

      // Create or get customer
      const customerResult = await stripeService.createCustomer(
        email,
        customerInfo?.name
      );
      if (!customerResult.success) {
        throw createValidationError("Failed to create customer");
      }

      // Create payment method
      const paymentMethodResult = await stripeService.createPaymentMethod(
        paymentMethod
      );
      if (!paymentMethodResult.success) {
        throw createValidationError("Failed to create payment method");
      }

      // Create subscription
      const subscriptionResult = await stripeService.createSubscription(
        customerResult.data.id,
        planId,
        paymentMethodResult.data.id
      );

      if (!subscriptionResult.success) {
        throw createValidationError("Failed to create subscription");
      }

      // Log successful checkout
      businessEventLogger("subscription_created", userId, {
        plan_id: planId,
        plan_name: selectedPlan.name,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        subscription_id: subscriptionResult.data.id,
        customer_id: customerResult.data.id,
      });

      // Return success response
      const response = formatSuccessResponse(
        {
          subscription: subscriptionResult.data,
          customer: customerResult.data,
          plan: selectedPlan,
        },
        "Checkout completed successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's current subscription
   */
  static async getSubscription(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // TODO: Get subscription from database
      // For now, return mock data
      const mockSubscription = {
        id: `sub_${Date.now()}`,
        user_id: userId,
        plan_id: "plan_pro",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        cancel_at_period_end: false,
        created_at: new Date().toISOString(),
      };

      const response = formatSuccessResponse(
        mockSubscription,
        "Subscription retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { planId } = req.body;

      if (!planId) {
        throw createValidationError("Plan ID is required");
      }

      // Validate new plan exists
      const plansResponse = await BillingController.getPlans(
        req,
        res,
        () => {}
      );
      const plans = (plansResponse as any).data;
      const selectedPlan = plans.find(
        (plan: SubscriptionPlan) => plan.id === planId
      );

      if (!selectedPlan) {
        throw createNotFoundError("Subscription plan");
      }

      // TODO: Update subscription in database and Stripe
      // For now, return mock success
      const mockUpdatedSubscription = {
        id: `sub_${Date.now()}`,
        user_id: userId,
        plan_id: planId,
        status: "active",
        updated_at: new Date().toISOString(),
      };

      // Log subscription update
      businessEventLogger("subscription_updated", userId, {
        new_plan_id: planId,
        new_plan_name: selectedPlan.name,
      });

      const response = formatSuccessResponse(
        mockUpdatedSubscription,
        "Subscription updated successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        throw createValidationError("Subscription ID is required");
      }

      // Cancel subscription in Stripe
      const cancelResult = await stripeService.cancelSubscription(
        subscriptionId
      );
      if (!cancelResult.success) {
        throw createValidationError("Failed to cancel subscription");
      }

      // Log subscription cancellation
      businessEventLogger("subscription_cancelled", userId, {
        subscription_id: subscriptionId,
      });

      const response = formatSuccessResponse(
        cancelResult.data,
        "Subscription cancelled successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get billing history
   */
  static async getBillingHistory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // TODO: Get billing history from database
      // For now, return mock data
      const mockBillingHistory = [
        {
          id: `invoice_${Date.now()}`,
          user_id: userId,
          amount: 29.99,
          currency: "USD",
          status: "paid",
          description: "Pro Plan - Monthly",
          period_start: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          period_end: new Date().toISOString(),
          paid_at: new Date().toISOString(),
          invoice_url: `https://example.com/invoices/invoice_${Date.now()}`,
        },
      ];

      const response = formatSuccessResponse(
        mockBillingHistory,
        "Billing history retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      // TODO: Get payment methods from database
      // For now, return mock data
      const mockPaymentMethods = [
        {
          id: `pm_${Date.now()}`,
          user_id: userId,
          type: "card",
          last4: "4242",
          brand: "visa",
          expiry_month: 12,
          expiry_year: 2025,
          is_default: true,
          created_at: new Date().toISOString(),
        },
      ];

      const response = formatSuccessResponse(
        mockPaymentMethods,
        "Payment methods retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add payment method
   */
  static async addPaymentMethod(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { paymentMethod } = req.body;

      if (!paymentMethod) {
        throw createValidationError("Payment method is required");
      }

      // Create payment method in Stripe
      const paymentMethodResult = await stripeService.createPaymentMethod(
        paymentMethod
      );
      if (!paymentMethodResult.success) {
        throw createValidationError("Failed to create payment method");
      }

      // Log payment method addition
      businessEventLogger("payment_method_added", userId, {
        payment_method_id: paymentMethodResult.data.id,
        payment_method_type: paymentMethod.type,
      });

      const response = formatSuccessResponse(
        paymentMethodResult.data,
        "Payment method added successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
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
      const signature = req.headers["stripe-signature"] as string;
      const payload = JSON.stringify(req.body);

      // Verify webhook signature
      const isValid = await stripeService.verifyWebhook(payload, signature);
      if (!isValid) {
        securityEventLogger(
          "webhook_verification_failed",
          "high",
          undefined,
          req.ip,
          {
            service: "stripe",
          }
        );
        throw createValidationError("Invalid webhook signature");
      }

      // Process webhook event
      const processResult = await stripeService.processWebhook(req.body);
      if (!processResult.success) {
        throw createValidationError("Failed to process webhook");
      }

      // Log webhook processing
      businessEventLogger("webhook_processed", undefined, {
        service: "stripe",
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

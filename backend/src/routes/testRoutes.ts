/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Test Routes for SlickText Integration
 *
 * These routes provide endpoints for testing SlickText integration
 * without hitting the live API.
 */

import { Router, Request, Response, NextFunction } from "express";
import {
  slickTextServiceWrapper,
  isUsingMocks,
  forceMockMode,
  forceRealMode,
} from "../mocks/slicktextServiceWrapper";
import { mockGetWebhookEvents } from "../mocks/slicktextMockService";
import { formatSuccessResponse, createValidationError } from "../utils";

const router = Router();

// ============================================================================
// Test Routes
// ============================================================================

/**
 * @route   GET /api/test/slicktext/status
 * @desc    Get current SlickText service status (mock vs real)
 * @access  Public (for testing)
 */
router.get(
  "/slicktext/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = formatSuccessResponse(
        {
          usingMocks: isUsingMocks(),
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "SlickText service status retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/mode
 * @desc    Switch between mock and real API mode
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/mode",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mode } = req.body;

      if (!mode || !["mock", "real"].includes(mode)) {
        throw createValidationError("Mode must be 'mock' or 'real'");
      }

      if (mode === "mock") {
        forceMockMode();
      } else {
        forceRealMode();
      }

      const response = formatSuccessResponse(
        {
          mode: mode,
          usingMocks: isUsingMocks(),
          timestamp: new Date().toISOString(),
        },
        `SlickText service switched to ${mode} mode`,
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/send
 * @desc    Test sending a message via SlickText
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/send",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listId, content, scheduledFor } = req.body;

      if (!listId || !content) {
        throw createValidationError("listId and content are required");
      }

      const scheduledDate = scheduledFor ? new Date(scheduledFor) : undefined;
      const result = await slickTextServiceWrapper.sendMessage(
        listId,
        content,
        scheduledDate
      );

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test message sent successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/subscribe
 * @desc    Test subscribing a contact via SlickText
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/subscribe",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listId, phone, firstName, lastName, email } = req.body;

      if (!listId || !phone) {
        throw createValidationError("listId and phone are required");
      }

      const customFields = {
        firstName,
        lastName,
        email,
      };

      const result = await slickTextServiceWrapper.subscribeContact(
        listId,
        phone,
        customFields
      );

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test contact subscribed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/test/slicktext/lists
 * @desc    Test getting lists via SlickText
 * @access  Public (for testing)
 */
router.get(
  "/slicktext/lists",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await slickTextServiceWrapper.getLists();

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test lists retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/test/slicktext/campaigns/:campaignId/stats
 * @desc    Test getting campaign stats via SlickText
 * @access  Public (for testing)
 */
router.get(
  "/slicktext/campaigns/:campaignId/stats",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        throw createValidationError("campaignId is required");
      }

      const result = await slickTextServiceWrapper.getCampaignStats(campaignId);

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test campaign stats retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/auto-reply
 * @desc    Test creating an auto-reply via SlickText
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/auto-reply",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keyword, message, isActive } = req.body;

      if (!keyword || !message) {
        throw createValidationError("keyword and message are required");
      }

      const result = await slickTextServiceWrapper.createAutoReply(
        keyword,
        message,
        isActive !== false
      );

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test auto-reply created successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/test/slicktext/balance
 * @desc    Test getting account balance via SlickText
 * @access  Public (for testing)
 */
router.get(
  "/slicktext/balance",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await slickTextServiceWrapper.getAccountBalance();

      const response = formatSuccessResponse(
        {
          result,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test account balance retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/webhook
 * @desc    Test webhook processing via SlickText
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventType } = req.body;

      if (!eventType) {
        throw createValidationError("eventType is required");
      }

      const webhookPayload = {
        id: `event_${Date.now()}`,
        type: eventType,
        data: {
          message_id: "msg_test",
          phone: "+1234567890",
        },
        timestamp: new Date().toISOString(),
      };

      const verifyResult = await slickTextServiceWrapper.verifyWebhook(
        JSON.stringify(webhookPayload),
        "test_signature"
      );

      const processResult = await slickTextServiceWrapper.processWebhook(
        webhookPayload
      );

      const response = formatSuccessResponse(
        {
          webhookPayload,
          verifyResult,
          processResult,
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Test webhook processed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/test/slicktext/webhook-events
 * @desc    Get available webhook event examples
 * @access  Public (for testing)
 */
router.get(
  "/slicktext/webhook-events",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isUsingMocks()) {
        throw createValidationError(
          "Webhook events endpoint is only available in mock mode"
        );
      }

      const result = await mockGetWebhookEvents();

      const response = formatSuccessResponse(
        {
          result,
          service: "mock",
          timestamp: new Date().toISOString(),
        },
        "Webhook events retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/error
 * @desc    Test error handling via SlickText
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/error",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errorType } = req.body;

      if (!errorType) {
        throw createValidationError("errorType is required");
      }

      const validErrorTypes = [
        "authentication_failed",
        "validation_error",
        "rate_limit_exceeded",
        "not_found",
        "server_error",
      ];

      if (!validErrorTypes.includes(errorType)) {
        throw createValidationError(
          `errorType must be one of: ${validErrorTypes.join(", ")}`
        );
      }

      if (!isUsingMocks()) {
        throw createValidationError(
          "Error testing is only available in mock mode"
        );
      }

      const result = await slickTextServiceWrapper.mockGenerateError(errorType);

      const response = formatSuccessResponse(
        {
          result,
          errorType,
          service: "mock",
          timestamp: new Date().toISOString(),
        },
        "Test error generated successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/test/slicktext/workflow
 * @desc    Test complete SlickText workflow
 * @access  Public (for testing)
 */
router.post(
  "/slicktext/workflow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowSteps = [];
      const startTime = Date.now();

      // Step 1: Get lists
      const listsResult = await slickTextServiceWrapper.getLists();
      workflowSteps.push({
        step: "get_lists",
        result: listsResult,
        timestamp: new Date().toISOString(),
      });

      if (!listsResult.success || !listsResult.data?.length) {
        throw createValidationError("Failed to retrieve lists");
      }

      const listId = listsResult.data[0].id;

      // Step 2: Subscribe a contact
      const subscribeResult = await slickTextServiceWrapper.subscribeContact(
        listId,
        "+1234567890",
        { firstName: "Workflow", lastName: "Test", email: "workflow@test.com" }
      );
      workflowSteps.push({
        step: "subscribe_contact",
        result: subscribeResult,
        timestamp: new Date().toISOString(),
      });

      // Step 3: Send a message
      const messageResult = await slickTextServiceWrapper.sendMessage(
        listId,
        "Workflow test message"
      );
      workflowSteps.push({
        step: "send_message",
        result: messageResult,
        timestamp: new Date().toISOString(),
      });

      // Step 4: Get message history
      const historyResult = await slickTextServiceWrapper.getMessageHistory(
        10,
        0
      );
      workflowSteps.push({
        step: "get_message_history",
        result: historyResult,
        timestamp: new Date().toISOString(),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      const response = formatSuccessResponse(
        {
          workflowSteps,
          summary: {
            totalSteps: workflowSteps.length,
            duration: `${duration}ms`,
            allSuccessful: workflowSteps.every((step) => step.result.success),
          },
          service: isUsingMocks() ? "mock" : "real",
          timestamp: new Date().toISOString(),
        },
        "Complete workflow test executed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

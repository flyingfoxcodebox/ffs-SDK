/**
 * Flying Fox Solutions - Messaging Dashboard Integration Example
 *
 * This example demonstrates how to use the Messaging Dashboard with the backend API
 * and shows the integration between frontend and backend SlickText API v2 services.
 */

import React, { useState, useEffect } from "react";
import { MessagingDashboard } from "@ffx/components/blueprints/messaging";
import { messagingApiClient } from "@ffx/components/blueprints/messaging/services/apiClient";
import { Button, Toast } from "@ffx/components/ui";
import type {
  SlickTextConfig,
  SendMessageRequest,
  SubscribeContactRequest,
} from "@ffx/components/blueprints/messaging/types";

// ============================================================================
// Example Configuration
// ============================================================================

const EXAMPLE_CONFIG: SlickTextConfig = {
  publicKey: "demo_public_key",
  privateKey: "demo_private_key",
  brandId: "demo_brand_123",
  baseUrl: "https://dev.slicktext.com/v1",
  sandboxMode: true,
};

// ============================================================================
// Integration Example Component
// ============================================================================

export const MessagingDashboardIntegration: React.FC = () => {
  const [config, setConfig] = useState<SlickTextConfig>(EXAMPLE_CONFIG);
  const [serviceStatus, setServiceStatus] = useState<{
    usingMocks: boolean;
    service: "mock" | "real";
  } | null>(null);
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      variant: "success" | "error" | "info" | "warning";
      show: boolean;
    }>
  >([]);

  // Load service status on mount
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await messagingApiClient.getServiceStatus();
        setServiceStatus(status);
      } catch (error) {
        console.error("Failed to load service status:", error);
        addToast("Failed to connect to backend API", "error");
      }
    };
    loadStatus();
  }, []);

  // Toast management
  const addToast = (
    message: string,
    variant: "success" | "error" | "info" | "warning"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, show: true }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Handle configuration updates
  const handleConfigUpdate = (newConfig: SlickTextConfig) => {
    setConfig(newConfig);
    addToast("Configuration updated successfully", "success");
  };

  // Test API integration functions
  const testSendMessage = async () => {
    try {
      const request: SendMessageRequest = {
        content: "Hello from the integration example! This is a test message.",
        listId: "list_1",
      };

      const result = await messagingApiClient.sendMessage(request);
      addToast(
        `Message sent successfully! ID: ${result.message_id}`,
        "success"
      );
    } catch (error) {
      addToast(
        `Failed to send message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const testSubscribeContact = async () => {
    try {
      const request: SubscribeContactRequest = {
        listId: "list_1",
        phoneNumber: "+1234567890",
        customFields: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
      };

      const result = await messagingApiClient.subscribeContact(request);
      addToast(
        `Contact subscribed successfully! ID: ${result.subscriber_id}`,
        "success"
      );
    } catch (error) {
      addToast(
        `Failed to subscribe contact: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const testGetLists = async () => {
    try {
      const result = await messagingApiClient.getLists();
      addToast(`Retrieved ${result.result.length} lists`, "info");
      console.log("Lists:", result.result);
    } catch (error) {
      addToast(
        `Failed to get lists: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const testGetAccountBalance = async () => {
    try {
      const result = await messagingApiClient.getAccountBalance();
      addToast(
        `Account balance: ${result.result.currency}${result.result.balance}`,
        "info"
      );
    } catch (error) {
      addToast(
        `Failed to get account balance: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const testSwitchMode = async (mode: "mock" | "real") => {
    try {
      await messagingApiClient.switchMode(mode);
      const status = await messagingApiClient.getServiceStatus();
      setServiceStatus(status);
      addToast(`Switched to ${mode} mode`, "info");
    } catch (error) {
      addToast(
        `Failed to switch mode: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  const testWorkflow = async () => {
    try {
      const result = await messagingApiClient.testWorkflow();
      addToast(
        `Workflow test completed! ${
          result.summary.allSuccessful
            ? "All steps successful"
            : "Some steps failed"
        }`,
        result.summary.allSuccessful ? "success" : "warning"
      );
      console.log("Workflow result:", result);
    } catch (error) {
      addToast(
        `Workflow test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            show={toast.show}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Integration Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Messaging Dashboard Integration Example
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test the integration between frontend and backend SlickText API
                v2 services
              </p>
            </div>

            {/* Service Status */}
            {serviceStatus && (
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    serviceStatus.usingMocks
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      serviceStatus.usingMocks ? "bg-blue-500" : "bg-green-500"
                    }`}
                  />
                  <span>
                    {serviceStatus.usingMocks ? "Mock Mode" : "Live API"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={testSendMessage}>
              Test Send Message
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={testSubscribeContact}
            >
              Test Subscribe Contact
            </Button>
            <Button variant="secondary" size="sm" onClick={testGetLists}>
              Test Get Lists
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={testGetAccountBalance}
            >
              Test Account Balance
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => testSwitchMode("mock")}
            >
              Switch to Mock
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => testSwitchMode("real")}
            >
              Switch to Live
            </Button>
            <Button variant="primary" size="sm" onClick={testWorkflow}>
              Test Complete Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Messaging Dashboard */}
      <MessagingDashboard
        slickTextConfig={config}
        onConfigUpdate={handleConfigUpdate}
      />

      {/* Integration Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Integration Features Demonstrated
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Frontend-Backend Integration
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• API client connects to backend test routes</li>
                <li>• Real-time service status monitoring</li>
                <li>• Mock vs Live API mode switching</li>
                <li>• Error handling and user feedback</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                SlickText API v2 Features
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• HTTP Basic Auth with public/private keys</li>
                <li>• Message sending and contact subscription</li>
                <li>• List management and account balance</li>
                <li>• Comprehensive mock testing system</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Backend API Endpoints Used:
            </h5>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <div>GET /api/test/slicktext/status - Service status</div>
              <div>POST /api/test/slicktext/mode - Switch mode</div>
              <div>POST /api/test/slicktext/send - Send message</div>
              <div>POST /api/test/slicktext/subscribe - Subscribe contact</div>
              <div>GET /api/test/slicktext/lists - Get lists</div>
              <div>GET /api/test/slicktext/balance - Account balance</div>
              <div>
                POST /api/test/slicktext/workflow - Complete workflow test
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingDashboardIntegration;

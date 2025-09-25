/**
 * Flying Fox Solutions - Unified Import Demo
 *
 * This example demonstrates the unified import system for the Flying Fox Template Library.
 * Shows how to import components, hooks, and blueprints using clean, consistent paths.
 */

import React, { useState } from "react";

// ============================================================================
// Unified Imports - Clean Paths
// ============================================================================

// Import atomic components
import { Button, InputField, Toast } from "@ffx/components";

// Import blueprint components
import { MessagingDashboard, POSDashboard } from "@ffx/blueprints";

// Import hooks
import { useProducts } from "@ffx/hooks";

// Import types
import type { Product } from "@ffx/types";

// ============================================================================
// Demo Component
// ============================================================================

export const UnifiedImportDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<
    "messaging" | "pos" | "components"
  >("components");
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      variant: "success" | "error" | "info" | "warning";
      show: boolean;
    }>
  >([]);

  // Use the imported hook
  const { products, loading, error } = useProducts();

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

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🎯 Unified Import System Demo
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Demonstrating clean, consistent import paths across the Flying Fox
              Template Library
            </p>
          </div>
        </div>
      </div>

      {/* Demo Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={selectedDemo === "components" ? "primary" : "secondary"}
            onClick={() => setSelectedDemo("components")}
          >
            Atomic Components
          </Button>
          <Button
            variant={selectedDemo === "messaging" ? "primary" : "secondary"}
            onClick={() => setSelectedDemo("messaging")}
          >
            Messaging Blueprint
          </Button>
          <Button
            variant={selectedDemo === "pos" ? "primary" : "secondary"}
            onClick={() => setSelectedDemo("pos")}
          >
            POS Blueprint
          </Button>
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          {selectedDemo === "components" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                🧱 Atomic Components Demo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* InputField Demo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    InputField Component
                  </h3>
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value=""
                    onChange={() => {}}
                  />
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value=""
                    onChange={() => {}}
                  />
                </div>

                {/* Button Demo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Button Component
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      onClick={() =>
                        addToast("Primary button clicked!", "success")
                      }
                    >
                      Primary Button
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        addToast("Secondary button clicked!", "info")
                      }
                    >
                      Secondary Button
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        addToast("Danger button clicked!", "error")
                      }
                    >
                      Danger Button
                    </Button>
                  </div>
                </div>
              </div>

              {/* Import Code Example */}
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Import Code:
                </h4>
                <code className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {`import { Button, InputField, Toast } from "@ffx/components";`}
                </code>
              </div>
            </div>
          )}

          {selectedDemo === "messaging" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                📱 Messaging Blueprint Demo
              </h2>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The MessagingDashboard is a complete blueprint that combines
                  atomic components into a full-featured SMS messaging
                  application.
                </p>
                <Button
                  variant="primary"
                  onClick={() =>
                    addToast("MessagingDashboard loaded!", "success")
                  }
                >
                  Load Messaging Dashboard
                </Button>
              </div>

              {/* Import Code Example */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Import Code:
                </h4>
                <code className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {`import { MessagingDashboard } from "@ffx/blueprints";`}
                </code>
              </div>
            </div>
          )}

          {selectedDemo === "pos" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                🛒 POS Blueprint Demo
              </h2>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The POSDashboard is a complete blueprint that combines atomic
                  components into a full-featured Point of Sale application.
                </p>

                {/* Hook Demo */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    useProducts Hook Demo:
                  </h4>
                  {loading && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading products...
                    </p>
                  )}
                  {error && (
                    <p className="text-red-600 dark:text-red-400">
                      Error: {error}
                    </p>
                  )}
                  {products && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Found {products.length} products available
                    </p>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={() => addToast("POSDashboard loaded!", "success")}
                >
                  Load POS Dashboard
                </Button>
              </div>

              {/* Import Code Example */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Import Code:
                </h4>
                <code className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {`import { POSDashboard } from "@ffx/blueprints";
import { useProducts } from "@ffx/hooks";`}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Import System Overview */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            🎯 Unified Import System Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Available Import Paths:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <code>@ffx/components</code> - All atomic components
                </li>
                <li>
                  <code>@ffx/blueprints</code> - All blueprint applications
                </li>
                <li>
                  <code>@ffx/hooks</code> - All custom hooks
                </li>
                <li>
                  <code>@ffx/services</code> - All service clients
                </li>
                <li>
                  <code>@ffx/types</code> - All type definitions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Namespace Imports:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <code>import * as components from "@ffx/components"</code>
                </li>
                <li>
                  <code>import * as hooks from "@ffx/hooks"</code>
                </li>
                <li>
                  <code>import * as blueprints from "@ffx/blueprints"</code>
                </li>
                <li>
                  <code>import * as services from "@ffx/services"</code>
                </li>
                <li>
                  <code>import * as types from "@ffx/types"</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedImportDemo;

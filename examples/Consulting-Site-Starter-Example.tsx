/**
 * Flying Fox Solutions - Consulting Site Starter Example
 *
 * Complete example demonstrating how to use the Consulting Site Starter
 * with custom configuration and integration examples.
 */

import React, { useState } from "react";
import { ConsultingSite } from "@ffx/blueprints";
import type { ConsultingSiteConfig, User } from "@ffx/types";

// ============================================================================
// Example Configuration
// ============================================================================

const exampleConfig: ConsultingSiteConfig = {
  features: {
    messaging: true,
    billing: true,
    pos: true,
    analytics: true,
  },
  integrations: {
    slicktext: {
      enabled: true,
      apiKey: "demo_slicktext_key_123",
    },
    stripe: {
      enabled: true,
      publicKey: "pk_test_demo_stripe_key_456",
    },
    square: {
      enabled: false,
      applicationId: "sandbox-sq0idb-demo_square_key_789",
    },
  },
  branding: {
    companyName: "Wilderness Adventures",
    logo: undefined, // Could be a URL to a logo image
    primaryColor: "#059669", // Emerald green for outdoor theme
    secondaryColor: "#0D9488", // Teal accent
  },
};

const exampleUser: User = {
  id: "user_wilderness_001",
  email: "sarah.johnson@wildernessadventures.com",
  firstName: "Sarah",
  lastName: "Johnson",
  avatar: undefined,
  role: "admin",
  company: "Wilderness Adventures",
  lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  isActive: true,
};

// ============================================================================
// Example Component with State Management
// ============================================================================

export const ConsultingSiteStarterExample: React.FC = () => {
  const [config, setConfig] = useState<ConsultingSiteConfig>(exampleConfig);
  const [user, setUser] = useState<User>(exampleUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Handle user updates (e.g., profile changes)
  const handleUserUpdate = (updatedUser: User) => {
    console.log("User updated:", updatedUser);
    setUser(updatedUser);

    // In a real app, you'd make an API call here
    // await updateUserAPI(updatedUser);
  };

  // Handle configuration updates (e.g., feature toggles)
  const handleConfigUpdate = (updatedConfig: ConsultingSiteConfig) => {
    console.log("Configuration updated:", updatedConfig);
    setConfig(updatedConfig);

    // In a real app, you'd save this to your backend
    // await saveConfigAPI(updatedConfig);
  };

  // Simulate authentication state
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(exampleUser); // Reset to default user
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">WA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to {config.branding.companyName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your complete business management platform
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign In (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">🎯</span>
            <span className="font-medium">Consulting Site Starter Demo</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-90">
              {config.branding.companyName} • {user.role.toUpperCase()}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <ConsultingSite
        config={config}
        user={user}
        onUserUpdate={handleUserUpdate}
        onConfigUpdate={handleConfigUpdate}
      />

      {/* Demo Information Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🚀 Features Demonstrated
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Responsive sidebar navigation</li>
                <li>• Dashboard with business metrics</li>
                <li>• Messaging blueprint integration</li>
                <li>• Billing and subscription management</li>
                <li>• POS system integration</li>
                <li>• Settings and preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🧱 Components Used
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Layout, Sidebar, Header</li>
                <li>• Button, InputField, Modal</li>
                <li>• Toast, FormGroup, Spinner</li>
                <li>• MessagingDashboard</li>
                <li>• BillingDashboard</li>
                <li>• POSDashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🔧 Customization Options
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Brand colors and logo</li>
                <li>• Feature toggles</li>
                <li>• Integration settings</li>
                <li>• Navigation customization</li>
                <li>• User role management</li>
                <li>• Theme and preferences</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is a complete SaaS-style web application template built with
              the Flying Fox Template Library. All data is mocked for
              demonstration purposes. In a real application, you would connect
              to your backend APIs and implement proper authentication and data
              persistence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Alternative Configuration Examples
// ============================================================================

// Marketing Agency Configuration
export const marketingAgencyConfig: ConsultingSiteConfig = {
  features: {
    messaging: true,
    billing: true,
    pos: false, // Marketing agencies typically don't need POS
    analytics: true,
  },
  integrations: {
    slicktext: {
      enabled: true,
      apiKey: "marketing_agency_key",
    },
    stripe: {
      enabled: true,
      publicKey: "marketing_stripe_key",
    },
    hubspot: {
      enabled: true,
      apiKey: "marketing_hubspot_key",
    },
  },
  branding: {
    companyName: "Creative Marketing Solutions",
    primaryColor: "#7C3AED", // Purple
    secondaryColor: "#EC4899", // Pink
  },
};

// Event Planning Configuration
export const eventPlanningConfig: ConsultingSiteConfig = {
  features: {
    messaging: true,
    billing: true,
    pos: true, // Event planners need POS for ticket sales
    analytics: true,
  },
  integrations: {
    slicktext: {
      enabled: true,
      apiKey: "event_planning_key",
    },
    stripe: {
      enabled: true,
      publicKey: "event_stripe_key",
    },
    square: {
      enabled: true,
      applicationId: "event_square_key",
    },
  },
  branding: {
    companyName: "Elite Event Planning",
    primaryColor: "#DC2626", // Red
    secondaryColor: "#F59E0B", // Amber
  },
};

// Outdoor School Configuration
export const outdoorSchoolConfig: ConsultingSiteConfig = {
  features: {
    messaging: true,
    billing: true,
    pos: true, // Outdoor schools sell equipment and courses
    analytics: true,
  },
  integrations: {
    slicktext: {
      enabled: true,
      apiKey: "outdoor_school_key",
    },
    stripe: {
      enabled: true,
      publicKey: "outdoor_stripe_key",
    },
  },
  branding: {
    companyName: "Mountain Peak Outdoor School",
    primaryColor: "#059669", // Emerald
    secondaryColor: "#0D9488", // Teal
  },
};

export default ConsultingSiteStarterExample;

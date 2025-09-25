/**
 * Flying Fox Solutions - SlickText API v2 Integration Example
 *
 * This example demonstrates how to use the SlickText API v2 integration
 * for common SMS messaging operations including subscribing users,
 * sending messages, and fetching campaign statistics.
 */

import React, { useState, useEffect } from "react";
import { slicktextService } from "../components/blueprints/messaging/services/slicktext";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { FormGroup } from "../components/ui/FormGroup";
import { Toast } from "../components/ui/Toast";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";

// ============================================================================
// Types
// ============================================================================

interface Subscriber {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: "active" | "inactive";
}

interface Campaign {
  id: string;
  name: string;
  content: string;
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

interface List {
  id: string;
  name: string;
  subscriber_count: number;
  created_at: string;
}

// ============================================================================
// SlickText Integration Example Component
// ============================================================================

export default function SlickTextIntegrationExample() {
  // State management
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Form states
  const [newSubscriber, setNewSubscriber] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [newMessage, setNewMessage] = useState({
    content: "",
    listId: "",
    campaignName: "",
  });

  // UI states
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error" | "info" | "warning";
  }>({ show: false, message: "", variant: "success" });

  // ============================================================================
  // Service Configuration
  // ============================================================================

  useEffect(() => {
    // Configure SlickText service on component mount
    slicktextService.configure({
      publicKey:
        process.env.REACT_APP_SLICKTEXT_PUBLIC_KEY || "demo_public_key",
      privateKey:
        process.env.REACT_APP_SLICKTEXT_PRIVATE_KEY || "demo_private_key",
      brandId: process.env.REACT_APP_SLICKTEXT_BRAND_ID || "demo_brand_id",
      baseUrl:
        process.env.REACT_APP_SLICKTEXT_BASE_URL ||
        "https://dev.slicktext.com/v1",
      sandboxMode: process.env.NODE_ENV !== "production",
    });

    // Load initial data
    loadLists();
  }, []);

  // ============================================================================
  // API Functions
  // ============================================================================

  const loadLists = async () => {
    setLoading(true);
    try {
      const result = await slicktextService.getLists();
      if (result.success) {
        setLists(result.data);
        if (result.data.length > 0) {
          setSelectedListId(result.data[0].id);
          setNewMessage((prev) => ({ ...prev, listId: result.data[0].id }));
        }
      } else {
        showToast("Failed to load lists", "error");
      }
    } catch (error) {
      showToast("Error loading lists", "error");
      console.error("Error loading lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeContact = async () => {
    if (!newSubscriber.phone || !selectedListId) {
      showToast("Phone number and list selection are required", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await slicktextService.subscribeContact(
        selectedListId,
        newSubscriber.phone,
        {
          firstName: newSubscriber.firstName,
          lastName: newSubscriber.lastName,
          email: newSubscriber.email,
        }
      );

      if (result.success) {
        showToast("Contact subscribed successfully!", "success");
        setNewSubscriber({ phone: "", firstName: "", lastName: "", email: "" });
        setShowSubscribeModal(false);
        loadLists(); // Refresh lists to update subscriber count
      } else {
        showToast("Failed to subscribe contact", "error");
      }
    } catch (error) {
      showToast("Error subscribing contact", "error");
      console.error("Error subscribing contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.content || !newMessage.listId) {
      showToast("Message content and list selection are required", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await slicktextService.sendMessage(
        newMessage.listId,
        newMessage.content
      );

      if (result.success) {
        showToast("Message sent successfully!", "success");
        setNewMessage({
          content: "",
          listId: selectedListId,
          campaignName: "",
        });
        setShowMessageModal(false);
        loadCampaignStats(result.data.id);
      } else {
        showToast("Failed to send message", "error");
      }
    } catch (error) {
      showToast("Error sending message", "error");
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignStats = async (campaignId: string) => {
    try {
      const result = await slicktextService.getCampaignStats(campaignId);
      if (result.success) {
        setCampaigns((prev) => [...prev, result.data]);
      }
    } catch (error) {
      console.error("Error loading campaign stats:", error);
    }
  };

  const deleteSubscriber = async (subscriberId: string) => {
    setLoading(true);
    try {
      const result = await slicktextService.deleteSubscriber(subscriberId);
      if (result.success) {
        showToast("Subscriber deleted successfully", "success");
        loadLists(); // Refresh data
      } else {
        showToast("Failed to delete subscriber", "error");
      }
    } catch (error) {
      showToast("Error deleting subscriber", "error");
      console.error("Error deleting subscriber:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // UI Helper Functions
  // ============================================================================

  const showToast = (
    message: string,
    variant: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            SlickText API v2 Integration Example
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Demonstrate SMS messaging functionality with SlickText API v2
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
              <Spinner size="md" color="primary" />
              <span className="text-gray-700 dark:text-gray-300">
                Processing...
              </span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lists Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              SlickText Lists
            </h2>

            {lists.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No lists found</p>
            ) : (
              <div className="space-y-3">
                {lists.map((list) => (
                  <div
                    key={list.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedListId === list.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => {
                      setSelectedListId(list.id);
                      setNewMessage((prev) => ({ ...prev, listId: list.id }));
                    }}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {list.subscriber_count} subscribers
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Created: {new Date(list.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                onClick={() => setShowSubscribeModal(true)}
                variant="primary"
                className="w-full"
              >
                Subscribe New Contact
              </Button>
              <Button
                onClick={() => setShowMessageModal(true)}
                variant="secondary"
                className="w-full"
                disabled={!selectedListId}
              >
                Send Message
              </Button>
            </div>
          </div>

          {/* Campaigns Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Campaign Statistics
            </h2>

            {campaigns.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No campaigns yet. Send a message to see statistics.
              </p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {campaign.name || "Untitled Campaign"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Sent:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {campaign.sent}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Delivered:
                        </span>
                        <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                          {campaign.delivered}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Failed:
                        </span>
                        <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                          {campaign.failed}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Opened:
                        </span>
                        <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                          {campaign.opened}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Clicked:
                        </span>
                        <span className="ml-2 font-medium text-purple-600 dark:text-purple-400">
                          {campaign.clicked}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Unsubscribed:
                        </span>
                        <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">
                          {campaign.unsubscribed}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subscribe Contact Modal */}
        <Modal
          isOpen={showSubscribeModal}
          onClose={() => setShowSubscribeModal(false)}
          title="Subscribe New Contact"
          size="md"
        >
          <div className="space-y-4">
            <FormGroup label="Phone Number" required>
              <InputField
                type="tel"
                value={newSubscriber.phone}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="+1234567890"
                error=""
              />
            </FormGroup>

            <FormGroup label="First Name">
              <InputField
                type="text"
                value={newSubscriber.firstName}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder="John"
                error=""
              />
            </FormGroup>

            <FormGroup label="Last Name">
              <InputField
                type="text"
                value={newSubscriber.lastName}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                placeholder="Doe"
                error=""
              />
            </FormGroup>

            <FormGroup label="Email">
              <InputField
                type="email"
                value={newSubscriber.email}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="john@example.com"
                error=""
              />
            </FormGroup>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowSubscribeModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={subscribeContact}
                disabled={loading}
              >
                Subscribe Contact
              </Button>
            </div>
          </div>
        </Modal>

        {/* Send Message Modal */}
        <Modal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          title="Send SMS Message"
          size="md"
        >
          <div className="space-y-4">
            <FormGroup label="Campaign Name">
              <InputField
                type="text"
                value={newMessage.campaignName}
                onChange={(e) =>
                  setNewMessage((prev) => ({
                    ...prev,
                    campaignName: e.target.value,
                  }))
                }
                placeholder="Welcome Campaign"
                error=""
              />
            </FormGroup>

            <FormGroup label="Message Content" required>
              <textarea
                value={newMessage.content}
                onChange={(e) =>
                  setNewMessage((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Enter your message here..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {newMessage.content.length}/1600 characters
              </div>
            </FormGroup>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={sendMessage}
                disabled={loading || !newMessage.content}
              >
                Send Message
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast Notifications */}
        <Toast
          show={toast.show}
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast((prev) => ({ ...prev, show: false }))}
          duration={5000}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Usage Instructions
// ============================================================================

/*
SETUP INSTRUCTIONS:

1. Environment Variables:
   Add the following to your .env file:
   
   REACT_APP_SLICKTEXT_PUBLIC_KEY=your_public_key
   REACT_APP_SLICKTEXT_PRIVATE_KEY=your_private_key
   REACT_APP_SLICKTEXT_BRAND_ID=your_brand_id
   REACT_APP_SLICKTEXT_BASE_URL=https://dev.slicktext.com/v1

2. Import and Use:
   
   import SlickTextIntegrationExample from './examples/SlickText-Integration-Example';
   
   function App() {
     return <SlickTextIntegrationExample />;
   }

3. Features Demonstrated:
   
   - Service configuration and initialization
   - Loading and displaying SlickText lists
   - Subscribing contacts to lists
   - Sending SMS messages
   - Retrieving campaign statistics
   - Deleting subscribers
   - Error handling and user feedback
   - Loading states and UI interactions

4. API v2 Features:
   
   - HTTP Basic Authentication
   - List-based messaging
   - Campaign statistics
   - Subscriber management
   - Webhook support
   - Sandbox/production environments

5. Best Practices Shown:
   
   - Proper error handling
   - Loading states
   - User feedback via toasts
   - Form validation
   - Responsive design
   - Accessibility features
   - TypeScript integration
*/

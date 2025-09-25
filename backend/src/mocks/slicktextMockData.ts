/**
 * Flying Fox Solutions - SlickText API v2 Mock Data
 *
 * Comprehensive mock data for testing SlickText integration
 * without hitting the live API.
 */

// ============================================================================
// Mock Response Types (matching real API v2 structure)
// ============================================================================

export interface MockSlickTextContact {
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

export interface MockSlickTextMessage {
  id: string;
  content: string;
  list_id: string;
  status: "queued" | "sent" | "delivered" | "failed";
  scheduled_for?: string;
  created_at: string;
}

export interface MockSlickTextCampaign {
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

export interface MockSlickTextList {
  id: string;
  name: string;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface MockSlickTextAutoReply {
  id: string;
  keyword: string;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockSlickTextAccountBalance {
  balance: number;
  currency: string;
  last_updated: string;
}

// ============================================================================
// Mock Data Generators
// ============================================================================

export const generateMockId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMockTimestamp = (): string => {
  return new Date().toISOString();
};

// ============================================================================
// Mock Lists Data
// ============================================================================

export const mockLists: MockSlickTextList[] = [
  {
    id: "list_123456789",
    name: "Main Subscribers",
    subscriber_count: 1250,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "list_987654321",
    name: "VIP Customers",
    subscriber_count: 89,
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "list_555666777",
    name: "Newsletter Subscribers",
    subscriber_count: 3421,
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-22T16:30:00Z",
  },
];

// ============================================================================
// Mock Contacts Data
// ============================================================================

export const mockContacts: MockSlickTextContact[] = [
  {
    id: "contact_111222333",
    phone: "+1234567890",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    list_id: "list_123456789",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "contact_444555666",
    phone: "+1987654321",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    list_id: "list_987654321",
    status: "active",
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
  {
    id: "contact_777888999",
    phone: "+1555666777",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob.johnson@example.com",
    list_id: "list_123456789",
    status: "inactive",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-22T16:30:00Z",
  },
];

// ============================================================================
// Mock Messages Data
// ============================================================================

export const mockMessages: MockSlickTextMessage[] = [
  {
    id: "msg_aaa111222",
    content: "Welcome to our service! Reply STOP to opt out.",
    list_id: "list_123456789",
    status: "delivered",
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "msg_bbb333444",
    content: "Your order has been shipped! Track at example.com/track",
    list_id: "list_987654321",
    status: "sent",
    created_at: "2024-01-19T14:30:00Z",
  },
  {
    id: "msg_ccc555666",
    content: "Flash sale! 50% off everything today only!",
    list_id: "list_123456789",
    status: "queued",
    scheduled_for: "2024-01-25T09:00:00Z",
    created_at: "2024-01-18T16:45:00Z",
  },
];

// ============================================================================
// Mock Campaigns Data
// ============================================================================

export const mockCampaigns: MockSlickTextCampaign[] = [
  {
    id: "camp_111222333",
    name: "Welcome Campaign",
    content: "Welcome to our service! Reply STOP to opt out.",
    list_id: "list_123456789",
    status: "completed",
    sent_count: 1250,
    delivered_count: 1198,
    failed_count: 52,
    opened_count: 456,
    clicked_count: 89,
    unsubscribed_count: 12,
    created_at: "2024-01-20T10:00:00Z",
    sent_at: "2024-01-20T10:05:00Z",
  },
  {
    id: "camp_444555666",
    name: "Flash Sale Campaign",
    content: "Flash sale! 50% off everything today only!",
    list_id: "list_123456789",
    status: "scheduled",
    sent_count: 0,
    delivered_count: 0,
    failed_count: 0,
    opened_count: 0,
    clicked_count: 0,
    unsubscribed_count: 0,
    created_at: "2024-01-18T16:45:00Z",
  },
  {
    id: "camp_777888999",
    name: "VIP Exclusive Offer",
    content: "Exclusive 30% discount for VIP members only!",
    list_id: "list_987654321",
    status: "sent",
    sent_count: 89,
    delivered_count: 87,
    failed_count: 2,
    opened_count: 34,
    clicked_count: 12,
    unsubscribed_count: 1,
    created_at: "2024-01-19T14:30:00Z",
    sent_at: "2024-01-19T14:35:00Z",
  },
];

// ============================================================================
// Mock Auto-Replies Data
// ============================================================================

export const mockAutoReplies: MockSlickTextAutoReply[] = [
  {
    id: "reply_111222333",
    keyword: "STOP",
    message: "You have been unsubscribed. Reply START to resubscribe.",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "reply_444555666",
    keyword: "START",
    message: "Welcome back! You have been resubscribed to our messages.",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "reply_777888999",
    keyword: "HELP",
    message: "Text HELP for assistance or STOP to unsubscribe.",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
];

// ============================================================================
// Mock Account Balance
// ============================================================================

export const mockAccountBalance: MockSlickTextAccountBalance = {
  balance: 1250.75,
  currency: "USD",
  last_updated: "2024-01-22T16:30:00Z",
};

// ============================================================================
// Mock Error Responses
// ============================================================================

export const mockErrors = {
  authentication_failed: {
    success: false,
    error: "Authentication failed: Invalid credentials",
    code: "AUTHENTICATION_FAILED",
  },
  validation_error: {
    success: false,
    error: "Validation failed: Phone number is required",
    code: "VALIDATION_ERROR",
  },
  rate_limit_exceeded: {
    success: false,
    error: "Rate limit exceeded: Too many requests",
    code: "RATE_LIMIT_EXCEEDED",
  },
  not_found: {
    success: false,
    error: "Resource not found",
    code: "NOT_FOUND",
  },
  server_error: {
    success: false,
    error: "Internal server error",
    code: "SERVER_ERROR",
  },
};

// ============================================================================
// Mock Webhook Events
// ============================================================================

export const mockWebhookEvents = {
  message_delivered: {
    id: "event_111222333",
    type: "message.delivered",
    data: {
      message_id: "msg_aaa111222",
      phone: "+1234567890",
      delivered_at: "2024-01-20T10:01:00Z",
    },
    timestamp: "2024-01-20T10:01:00Z",
  },
  message_failed: {
    id: "event_444555666",
    type: "message.failed",
    data: {
      message_id: "msg_bbb333444",
      phone: "+1987654321",
      error_code: "INVALID_NUMBER",
      failed_at: "2024-01-19T14:31:00Z",
    },
    timestamp: "2024-01-19T14:31:00Z",
  },
  subscriber_opted_out: {
    id: "event_777888999",
    type: "subscriber.opted_out",
    data: {
      subscriber_id: "contact_111222333",
      phone: "+1234567890",
      opted_out_at: "2024-01-20T15:30:00Z",
    },
    timestamp: "2024-01-20T15:30:00Z",
  },
  subscriber_opted_in: {
    id: "event_aaa111222",
    type: "subscriber.opted_in",
    data: {
      subscriber_id: "contact_444555666",
      phone: "+1987654321",
      opted_in_at: "2024-01-21T09:15:00Z",
    },
    timestamp: "2024-01-21T09:15:00Z",
  },
};

// ============================================================================
// Utility Functions for Mock Data
// ============================================================================

export const findMockList = (listId: string): MockSlickTextList | undefined => {
  return mockLists.find((list) => list.id === listId);
};

export const findMockContact = (
  contactId: string
): MockSlickTextContact | undefined => {
  return mockContacts.find((contact) => contact.id === contactId);
};

export const findMockMessage = (
  messageId: string
): MockSlickTextMessage | undefined => {
  return mockMessages.find((message) => message.id === messageId);
};

export const findMockCampaign = (
  campaignId: string
): MockSlickTextCampaign | undefined => {
  return mockCampaigns.find((campaign) => campaign.id === campaignId);
};

export const findMockAutoReply = (
  autoReplyId: string
): MockSlickTextAutoReply | undefined => {
  return mockAutoReplies.find((reply) => reply.id === autoReplyId);
};

export const generateMockContact = (
  overrides: Partial<MockSlickTextContact> = {}
): MockSlickTextContact => {
  return {
    id: generateMockId("contact"),
    phone: "+1234567890",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    list_id: "list_123456789",
    status: "active",
    created_at: generateMockTimestamp(),
    updated_at: generateMockTimestamp(),
    ...overrides,
  };
};

export const generateMockMessage = (
  overrides: Partial<MockSlickTextMessage> = {}
): MockSlickTextMessage => {
  return {
    id: generateMockId("msg"),
    content: "Test message content",
    list_id: "list_123456789",
    status: "queued",
    created_at: generateMockTimestamp(),
    ...overrides,
  };
};

export const generateMockCampaign = (
  overrides: Partial<MockSlickTextCampaign> = {}
): MockSlickTextCampaign => {
  return {
    id: generateMockId("camp"),
    name: "Test Campaign",
    content: "Test campaign content",
    list_id: "list_123456789",
    status: "draft",
    sent_count: 0,
    delivered_count: 0,
    failed_count: 0,
    opened_count: 0,
    clicked_count: 0,
    unsubscribed_count: 0,
    created_at: generateMockTimestamp(),
    ...overrides,
  };
};

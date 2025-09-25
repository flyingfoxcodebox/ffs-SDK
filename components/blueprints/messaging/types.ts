/**
 * Messaging Blueprint Types
 * ------------------------
 * Core type definitions for SMS messaging functionality
 */

// ✅ Message Types
export interface Message {
  id: string;
  content: string;
  segments: MessageSegment[];
  recipientCount: number;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  cost: number;
  currency: string;
}

export interface MessageSegment {
  id: string;
  content: string;
  characterCount: number;
  isUnicode: boolean;
  estimatedCost: number;
}

// ✅ Contact Types
export interface Contact {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tags?: string[];
  isOptedIn: boolean;
  createdAt: string;
  lastContacted?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  contacts: Contact[];
  createdAt: string;
}

// ✅ Campaign Types
export interface Campaign {
  id: string;
  name: string;
  message: Message;
  recipients: Contact[];
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";
  scheduledAt?: string;
  sentAt?: string;
  deliveryStats: DeliveryStats;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryRate: number;
  cost: number;
  currency: string;
}

// ✅ SlickText API v2 Configuration
export interface SlickTextConfig {
  apiKey: string; // This will be the public key for API v2
  accountId: string; // This will be the brand ID for API v2
  baseUrl: string;
  sandboxMode: boolean;
}

// ✅ API Response Types
export interface SlickTextResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SendMessageRequest {
  message: string;
  recipients: string[];
  scheduledAt?: string;
  campaignName?: string;
}

export interface SendMessageResponse {
  campaignId: string;
  messageId: string;
  recipientCount: number;
  estimatedCost: number;
  scheduledAt?: string;
}

// ✅ Upload Types
export interface ContactUploadResult {
  success: boolean;
  totalRows: number;
  validContacts: Contact[];
  errors: ContactUploadError[];
  duplicates: Contact[];
}

export interface ContactUploadError {
  row: number;
  phoneNumber: string;
  error: string;
}

// ✅ Auto-Reply Types
export interface AutoReply {
  id: string;
  keyword: string;
  message: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  triggerCount: number;
}

export interface AutoReplyTrigger {
  id: string;
  autoReplyId: string;
  phoneNumber: string;
  keyword: string;
  message: string;
  triggeredAt: string;
  responseSent: boolean;
}

// ✅ Billing Integration Types
export interface SmsUsage {
  month: string;
  messagesSent: number;
  cost: number;
  currency: string;
  creditsRemaining: number;
}

export interface SmsCredit {
  balance: number;
  currency: string;
  lastUpdated: string;
  autoRecharge: boolean;
  lowBalanceThreshold: number;
}

// ✅ Webhook Types
export interface SlickTextWebhook {
  event:
    | "message.sent"
    | "message.delivered"
    | "message.failed"
    | "contact.opted_in"
    | "contact.opted_out";
  timestamp: string;
  data: {
    messageId: string;
    campaignId?: string;
    phoneNumber: string;
    status?: string;
    error?: string;
  };
}

// ✅ Component Props Types
export interface MessageComposerProps {
  onSend?: (message: Message, recipients: Contact[]) => void | Promise<void>;
  onSaveDraft?: (message: Message) => void | Promise<void>;
  onSchedule?: (
    message: Message,
    scheduledAt: string,
    recipients: Contact[]
  ) => void | Promise<void>;
  initialMessage?: string;
  maxCharacters?: number;
  className?: string;
}

export interface ContactListUploaderProps {
  onUpload?: (contacts: Contact[]) => void | Promise<void>;
  onValidate?: (contacts: Contact[]) => ContactUploadResult;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  className?: string;
}

export interface MessagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message;
  recipients: Contact[];
  onSend?: () => void | Promise<void>;
  onSchedule?: (scheduledAt: string) => void | Promise<void>;
  className?: string;
}

export interface MessageHistoryProps {
  onViewCampaign?: (campaign: Campaign) => void;
  onResend?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  className?: string;
}

export interface AutoReplyManagerProps {
  onSave?: (autoReply: AutoReply) => void | Promise<void>;
  onDelete?: (autoReplyId: string) => void | Promise<void>;
  onToggle?: (autoReplyId: string, isActive: boolean) => void | Promise<void>;
  className?: string;
}

export interface MessagingDashboardProps {
  slickTextConfig?: SlickTextConfig;
  onConfigUpdate?: (config: SlickTextConfig) => void;
  className?: string;
}

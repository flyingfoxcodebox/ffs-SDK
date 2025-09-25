// ✅ Messaging Blueprint Components
export { default as MessageComposer } from "./MessageComposer";
export type { MessageComposerProps } from "./MessageComposer";

export { default as ContactListUploader } from "./ContactListUploader";
export type { ContactListUploaderProps } from "./ContactListUploader";

export { default as MessagePreviewModal } from "./MessagePreviewModal";
export type { MessagePreviewModalProps } from "./MessagePreviewModal";

export { default as MessageHistory } from "./MessageHistory";
export type { MessageHistoryProps } from "./MessageHistory";

export { default as AutoReplyManager } from "./AutoReplyManager";
export type { AutoReplyManagerProps } from "./AutoReplyManager";

export { default as MessagingDashboard } from "./MessagingDashboard";
export type { MessagingDashboardProps } from "./MessagingDashboard";

// ✅ Types
export type {
  Message,
  Contact,
  Campaign,
  MessageSegment,
  SlickTextConfig,
} from "./types";

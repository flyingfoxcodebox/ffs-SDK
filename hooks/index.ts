/**
 * Flying Fox Solutions - Hooks Barrel Export
 *
 * Centralized export for all custom hooks across the template library.
 * This provides a single import point for all hooks.
 */

// ============================================================================
// Blueprint Hooks
// ============================================================================

// Messaging Hooks
export { useMessaging } from "../components/blueprints/messaging/hooks/useMessaging";
export { useContacts } from "../components/blueprints/messaging/hooks/useContacts";
export { useCampaigns } from "../components/blueprints/messaging/hooks/useCampaigns";

// POS Hooks
export { useCart } from "../components/blueprints/pos/hooks/useCart";
export { useProducts } from "../components/blueprints/pos/hooks/useProducts";
export { useOrders } from "../components/blueprints/pos/hooks/useOrders";

// Billing Hooks
export { useBillingData } from "../components/billing/hooks/useBillingData";
export { useInvoices } from "../components/billing/hooks/useInvoices";

// ============================================================================
// Hook Types
// ============================================================================

export type {
  // Messaging Hook Types
  UseMessagingReturn,
  UseContactsReturn,
  UseCampaignsReturn,
} from "../components/blueprints/messaging/types";

export type {
  // POS Hook Types
  UseCartReturn,
  UseProductsReturn,
  UseOrdersReturn,
} from "../components/blueprints/pos/types";

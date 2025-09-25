/**
 * Flying Fox Solutions - Services Barrel Export
 *
 * Centralized export for all service clients and API wrappers.
 * This provides a single import point for all services.
 */

// ============================================================================
// Messaging Services
// ============================================================================

export { messagingApiClient } from "../components/blueprints/messaging/services/apiClient";
export {
  SlickTextService,
  slickTextService,
} from "../components/blueprints/messaging/services/slicktext";

// ============================================================================
// Integration Services
// ============================================================================

export { default as HubSpotService } from "../integrations/hubspot";
export { default as QuickBooksService } from "../integrations/quickbooks";
export { default as SlickTextIntegration } from "../integrations/slicktext";
export { default as SquareService } from "../integrations/square";
export { default as StripeService } from "../integrations/stripe";
export { default as SupabaseService } from "../integrations/supabase";
export { default as XeroService } from "../integrations/xero";

// ============================================================================
// Service Types
// ============================================================================

export type {
  SlickTextConfig,
  SlickTextResponse,
  SendMessageRequest,
  // SubscribeContactRequest, // Temporarily commented out due to import issue
} from "../components/blueprints/messaging/types";

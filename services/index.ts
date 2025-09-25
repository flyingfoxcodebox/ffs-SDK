/**
 * Flying Fox Solutions - Services Barrel Export
 *
 * Centralized export for all service clients and API wrappers.
 * This provides a single import point for all services.
 */

// ============================================================================
// Backend Services (Primary)
// ============================================================================

// Export backend services as the primary implementations
export { slicktextService } from "../backend/src/services/slicktext";
export { stripeService } from "../backend/src/services/stripe";
export { squareService } from "../backend/src/services/square";
export { supabaseService } from "../backend/src/services/supabase";

// ============================================================================
// Component Services (Secondary)
// ============================================================================

// Export component services for frontend use
export { messagingApiClient } from "../components/blueprints/messaging/services/apiClient";
export {
  SlickTextService,
  slickTextService,
} from "../components/blueprints/messaging/services/slicktext";

// ============================================================================
// Integration Placeholders
// ============================================================================

// These are placeholder integrations - replace with actual implementations
export { default as HubSpotService } from "../integrations/hubspot";
export { default as QuickBooksService } from "../integrations/quickbooks";
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

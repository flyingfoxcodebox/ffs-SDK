/**
 * Flying Fox Solutions - Services Barrel Export
 *
 * Centralized export for all service clients and API wrappers.
 * This provides a single import point for all services.
 */

// ============================================================================
// Backend Services (Primary)
// ============================================================================

// Note: Backend services are not included in the main project scope
// They are available in the backend directory separately

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
// Integration Services
// ============================================================================

// Export integration services
export { default as HubSpotService } from "../integrations/hubspot";
export { default as QuickBooksService } from "../integrations/quickbooks";
export { default as XeroService } from "../integrations/xero";
export { default as SlickTextIntegration } from "../integrations/slicktext";
export { default as SquareIntegration } from "../integrations/square";
export { default as StripeIntegration } from "../integrations/stripe";
export { default as SupabaseIntegration } from "../integrations/supabase";

// ============================================================================
// Service Types
// ============================================================================

export type {
  SlickTextConfig,
  SlickTextResponse,
  SendMessageRequest,
  SubscribeContactRequest,
} from "../components/blueprints/messaging/types";

// Supabase integration types
export type {
  SupabaseConfig,
  SupabaseCustomer,
  AuthResult,
  SignUpData,
  SignInData,
  ResetPasswordData,
  SupabaseError,
  DatabaseValue,
  DatabaseTable,
} from "../integrations/supabase";

// Stripe integration types
export type {
  StripeConfig,
  StripeCustomer,
  StripePaymentIntent,
  StripeSubscription,
  CreatePaymentIntentRequest,
  CreateCustomerRequest,
  StripeWebhookEvent,
} from "../integrations/stripe";

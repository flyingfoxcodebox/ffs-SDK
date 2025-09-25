/**
 * Flying Fox Solutions - SlickText Service Wrapper
 *
 * Wrapper service that can switch between mock and real SlickText API calls
 * based on environment configuration.
 */

import { slicktextService } from "../services/slicktext";
import { SlickTextMockService } from "./slicktextMockService";
import { getEnvVar } from "../utils";

// ============================================================================
// Service Wrapper Class
// ============================================================================

export class SlickTextServiceWrapper {
  private useMocks: boolean;
  private mockService: SlickTextMockService;

  constructor() {
    // Check if we should use mocks based on environment variable
    this.useMocks =
      getEnvVar("USE_MOCKS", "false").toLowerCase() === "true" ||
      getEnvVar("NODE_ENV", "development") === "test";

    this.mockService = new SlickTextMockService();
  }

  /**
   * Get the appropriate service (mock or real) based on configuration
   */
  private getService() {
    return this.useMocks ? this.mockService : slicktextService;
  }

  /**
   * Check if currently using mocks
   */
  isUsingMocks(): boolean {
    return this.useMocks;
  }

  /**
   * Force switch to mock mode (useful for testing)
   */
  forceMockMode(): void {
    this.useMocks = true;
  }

  /**
   * Force switch to real API mode
   */
  forceRealMode(): void {
    this.useMocks = false;
  }

  // ============================================================================
  // Service Methods (delegate to appropriate service)
  // ============================================================================

  async sendMessage(listId: string, content: string, scheduledFor?: Date) {
    const service = this.getService();
    return await service.sendMessage(listId, content, scheduledFor);
  }

  async getMessageHistory(limit: number = 50, offset: number = 0) {
    const service = this.getService();
    return await service.getMessageHistory(limit, offset);
  }

  async subscribeContact(
    listId: string,
    phoneNumber: string,
    customFields?: Record<string, string>
  ) {
    const service = this.getService();
    return await service.subscribeContact(listId, phoneNumber, customFields);
  }

  async getContacts(limit: number = 50, offset: number = 0, tags?: string[]) {
    const service = this.getService();
    return await service.getContacts(limit, offset, tags);
  }

  async getCampaignStats(campaignId: string) {
    const service = this.getService();
    return await service.getCampaignStats(campaignId);
  }

  async getLists() {
    const service = this.getService();
    return await service.getLists();
  }

  async deleteSubscriber(subscriberId: string) {
    const service = this.getService();
    return await service.deleteSubscriber(subscriberId);
  }

  async getAutoReplies() {
    const service = this.getService();
    return await service.getAutoReplies();
  }

  async createAutoReply(
    keyword: string,
    message: string,
    isActive: boolean = true
  ) {
    const service = this.getService();
    return await service.createAutoReply(keyword, message, isActive);
  }

  async verifyWebhook(payload: string, signature: string) {
    const service = this.getService();
    return await service.verifyWebhook(payload, signature);
  }

  async processWebhook(payload: unknown) {
    const service = this.getService();
    return await service.processWebhook(payload);
  }

  async getAccountBalance() {
    const service = this.getService();
    return await service.getAccountBalance();
  }

  // ============================================================================
  // Mock-specific methods (only available when using mocks)
  // ============================================================================

  async mockGenerateError(
    errorType:
      | "authentication_failed"
      | "validation_error"
      | "rate_limit_exceeded"
      | "not_found"
      | "server_error"
  ) {
    if (!this.useMocks) {
      throw new Error("Mock methods are only available when USE_MOCKS=true");
    }
    return await this.mockService.mockGenerateError(errorType);
  }

  async mockGetWebhookEvents() {
    if (!this.useMocks) {
      throw new Error("Mock methods are only available when USE_MOCKS=true");
    }
    return await this.mockService.mockGetWebhookEvents();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const slickTextServiceWrapper = new SlickTextServiceWrapper();

// ============================================================================
// Convenience Functions
// ============================================================================

export const isUsingMocks = () => slickTextServiceWrapper.isUsingMocks();
export const forceMockMode = () => slickTextServiceWrapper.forceMockMode();
export const forceRealMode = () => slickTextServiceWrapper.forceRealMode();

// Export all service methods for convenience
export const {
  sendMessage,
  getMessageHistory,
  subscribeContact,
  getContacts,
  getCampaignStats,
  getLists,
  deleteSubscriber,
  getAutoReplies,
  createAutoReply,
  verifyWebhook,
  processWebhook,
  getAccountBalance,
  mockGenerateError,
  mockGetWebhookEvents,
} = slickTextServiceWrapper;

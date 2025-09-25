import { useState, useEffect, useCallback } from "react";
import { slickTextService } from "../services/slicktext";
import type {
  Message,
  Contact,
  Campaign,
  AutoReply,
  SlickTextConfig,
  SlickTextResponse,
} from "../types";

/**
 * useMessaging Hook
 * ----------------
 * Main hook for messaging functionality
 */

export const useMessaging = (config?: SlickTextConfig) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Update configuration
  useEffect(() => {
    if (config?.apiKey) {
      slickTextService.updateConfig(config);
      setIsConfigured(true);
      setError(null);
    } else {
      setIsConfigured(false);
    }
  }, [config]);

  // ✅ Send message
  const sendMessage = useCallback(
    async (
      message: string,
      recipients: string[],
      options?: {
        scheduledAt?: string;
        campaignName?: string;
      }
    ): Promise<SlickTextResponse> => {
      if (!isConfigured) {
        return {
          success: false,
          error: "SlickText not configured",
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await slickTextService.sendMessage({
          message,
          recipients,
          scheduledAt: options?.scheduledAt,
          campaignName: options?.campaignName,
        });

        if (!response.success) {
          setError(response.error || "Failed to send message");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  // ✅ Upload contacts
  const uploadContacts = useCallback(
    async (contacts: Contact[]): Promise<SlickTextResponse> => {
      if (!isConfigured) {
        return {
          success: false,
          error: "SlickText not configured",
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await slickTextService.uploadContacts(contacts);

        if (!response.success) {
          setError(response.error || "Failed to upload contacts");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  // ✅ Get message history
  const getMessageHistory = useCallback(
    async (limit = 50, offset = 0): Promise<SlickTextResponse<Campaign[]>> => {
      if (!isConfigured) {
        return {
          success: false,
          error: "SlickText not configured",
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await slickTextService.getMessageHistory(
          limit,
          offset
        );

        if (!response.success) {
          setError(response.error || "Failed to fetch message history");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  // ✅ Get contacts
  const getContacts = useCallback(
    async (limit = 100, offset = 0): Promise<SlickTextResponse<Contact[]>> => {
      if (!isConfigured) {
        return {
          success: false,
          error: "SlickText not configured",
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await slickTextService.getContacts(limit, offset);

        if (!response.success) {
          setError(response.error || "Failed to fetch contacts");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  // ✅ Create auto-reply
  const createAutoReply = useCallback(
    async (
      keyword: string,
      message: string
    ): Promise<SlickTextResponse<AutoReply>> => {
      if (!isConfigured) {
        return {
          success: false,
          error: "SlickText not configured",
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await slickTextService.createAutoReply(
          keyword,
          message
        );

        if (!response.success) {
          setError(response.error || "Failed to create auto-reply");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  // ✅ Get auto-replies
  const getAutoReplies = useCallback(async (): Promise<
    SlickTextResponse<AutoReply[]>
  > => {
    if (!isConfigured) {
      return {
        success: false,
        error: "SlickText not configured",
      };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await slickTextService.getAutoReplies();

      if (!response.success) {
        setError(response.error || "Failed to fetch auto-replies");
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  // ✅ Calculate message cost
  const calculateMessageCost = useCallback(
    (message: string, recipientCount: number): number => {
      const result = slickTextService.calculateMessageSegments(message);
      return result.totalCost * recipientCount;
    },
    []
  );

  return {
    isConfigured,
    loading,
    error,
    sendMessage,
    uploadContacts,
    getMessageHistory,
    getContacts,
    createAutoReply,
    getAutoReplies,
    calculateMessageCost,
  };
};

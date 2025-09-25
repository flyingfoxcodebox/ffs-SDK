/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Utility Functions
 */

import { ApiResponse, PaginatedResponse, ApiError, ErrorCode } from "../types";

// ============================================================================
// Response Formatters
// ============================================================================

/**
 * Format a successful API response
 */
export function formatSuccessResponse<T>(
  data: T,
  message: string = "Success",
  requestId?: string
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

/**
 * Format a paginated API response
 */
export function formatPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = "Success",
  requestId?: string
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    requestId,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Format an error API response
 */
export function formatErrorResponse(
  message: string,
  error?: string,
  requestId?: string
): ApiResponse {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

// ============================================================================
// Error Utilities
// ============================================================================

/**
 * Create a custom API error
 */
export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: ErrorCode,
  details?: any
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.isOperational = true;
  error.code = code;
  error.details = details;
  return error;
}

/**
 * Create validation error
 */
export function createValidationError(
  message: string,
  details?: any
): ApiError {
  return createApiError(message, 400, ErrorCode.VALIDATION_ERROR, details);
}

/**
 * Create authentication error
 */
export function createAuthError(
  message: string = "Authentication failed"
): ApiError {
  return createApiError(message, 401, ErrorCode.AUTHENTICATION_ERROR);
}

/**
 * Create authorization error
 */
export function createAuthzError(
  message: string = "Insufficient permissions"
): ApiError {
  return createApiError(message, 403, ErrorCode.AUTHORIZATION_ERROR);
}

/**
 * Create not found error
 */
export function createNotFoundError(resource: string = "Resource"): ApiError {
  return createApiError(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
}

/**
 * Create conflict error
 */
export function createConflictError(message: string): ApiError {
  return createApiError(message, 409, ErrorCode.CONFLICT);
}

/**
 * Create external API error
 */
export function createExternalApiError(
  service: string,
  message: string
): ApiError {
  return createApiError(
    `External API error (${service}): ${message}`,
    502,
    ErrorCode.EXTERNAL_API_ERROR,
    { service }
  );
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${generateRandomString(8)}`;
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Format date for API responses
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from string
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw createValidationError("Invalid date format");
  }
  return date;
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Round number to specified decimal places
 */
export function roundToDecimals(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundToDecimals((value / total) * 100);
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate string to specified length
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = "..."
): string {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

// ============================================================================
// Object Utilities
// ============================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Remove undefined values from object
 */
export function removeUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Pick specified keys from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specified keys from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delayMs = baseDelay * Math.pow(2, attempt);
      await delay(delayMs);
    }
  }

  throw lastError!;
}

// ============================================================================
// Environment Utilities
// ============================================================================

/**
 * Get environment variable with default value
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

/**
 * Get boolean environment variable
 */
export function getBooleanEnvVar(
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === "true";
}

/**
 * Get number environment variable
 */
export function getNumberEnvVar(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required`);
  }

  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
}

// ============================================================================
// External API Utilities
// ============================================================================

/**
 * Log external API calls
 */
export function externalApiLogger(
  service: string,
  method: string,
  url: string,
  statusCode?: number,
  duration?: number,
  error?: Error
): void {
  const metadata = {
    service,
    method,
    url,
    statusCode,
    duration: duration ? `${duration}ms` : undefined,
  };

  if (error) {
    console.error(`External API error (${service})`, error, metadata);
  } else {
    console.info(`External API call (${service})`, metadata);
  }
}

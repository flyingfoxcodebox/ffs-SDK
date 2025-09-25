/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from "express";
import { ApiError, ErrorCode } from "../types";
import { formatErrorResponse, createApiError } from "../utils";

// ============================================================================
// Error Handler Middleware
// ============================================================================

/**
 * Global error handler middleware
 * Handles all errors thrown in the application
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    (req.headers["x-request-id"] as string) || (req as any).requestId;

  // Log error details (in production, use proper logging service)
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    requestId,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle known API errors
  if (error instanceof Error && "statusCode" in error) {
    const apiError = error as ApiError;

    res
      .status(apiError.statusCode)
      .json(
        formatErrorResponse(
          apiError.message,
          apiError.details ? JSON.stringify(apiError.details) : undefined,
          requestId
        )
      );
    return;
  }

  // Handle validation errors (from express-validator or similar)
  if (error.name === "ValidationError") {
    res
      .status(400)
      .json(formatErrorResponse("Validation failed", error.message, requestId));
    return;
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    res
      .status(401)
      .json(
        formatErrorResponse(
          "Invalid token",
          "Authentication token is invalid or malformed",
          requestId
        )
      );
    return;
  }

  if (error.name === "TokenExpiredError") {
    res
      .status(401)
      .json(
        formatErrorResponse(
          "Token expired",
          "Authentication token has expired",
          requestId
        )
      );
    return;
  }

  // Handle MongoDB/Database errors
  if (error.name === "MongoError" || error.name === "MongooseError") {
    res
      .status(500)
      .json(
        formatErrorResponse(
          "Database error",
          "An error occurred while accessing the database",
          requestId
        )
      );
    return;
  }

  // Handle external API errors
  if (
    error.message.includes("External API") ||
    error.message.includes("fetch")
  ) {
    res
      .status(502)
      .json(
        formatErrorResponse(
          "External service error",
          "An external service is currently unavailable",
          requestId
        )
      );
    return;
  }

  // Handle rate limiting errors
  if (
    error.message.includes("rate limit") ||
    error.message.includes("too many requests")
  ) {
    res
      .status(429)
      .json(
        formatErrorResponse(
          "Rate limit exceeded",
          "Too many requests, please try again later",
          requestId
        )
      );
    return;
  }

  // Default to 500 Internal Server Error
  res
    .status(500)
    .json(
      formatErrorResponse(
        "Internal server error",
        process.env.NODE_ENV === "development" ? error.message : undefined,
        requestId
      )
    );
}

// ============================================================================
// Async Error Wrapper
// ============================================================================

/**
 * Wrapper for async route handlers to catch errors
 * Usage: wrapAsync(async (req, res, next) => { ... })
 */
export function wrapAsync<T extends any[]>(fn: (...args: T) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ============================================================================
// Not Found Handler
// ============================================================================

/**
 * Handle 404 Not Found errors
 */
export function notFoundHandler(req: Request, res: Response): void {
  const requestId =
    (req.headers["x-request-id"] as string) || (req as any).requestId;

  res
    .status(404)
    .json(
      formatErrorResponse(
        "Route not found",
        `The requested route ${req.method} ${req.path} was not found`,
        requestId
      )
    );
}

// ============================================================================
// Development Error Handler
// ============================================================================

/**
 * Enhanced error handler for development environment
 * Provides detailed error information
 */
export function developmentErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    (req.headers["x-request-id"] as string) || (req as any).requestId;

  // Log detailed error information
  console.error("Development Error:", {
    message: error.message,
    stack: error.stack,
    requestId,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    timestamp: new Date().toISOString(),
  });

  // Send detailed error response
  res.status(500).json({
    success: false,
    message: "Development Error",
    error: error.message,
    stack: error.stack,
    requestId,
    timestamp: new Date().toISOString(),
    details: {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    },
  });
}

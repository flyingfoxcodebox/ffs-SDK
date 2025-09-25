/**
 * Flying Fox Solutions - Backend API Boilerplate
 * CORS Configuration Middleware
 */

import { Request, Response, NextFunction } from "express";
import { getEnvVar, getBooleanEnvVar } from "../utils";

// ============================================================================
// CORS Configuration
// ============================================================================

/**
 * CORS configuration based on environment variables
 */
export function corsConfig() {
  const allowedOrigins = getEnvVar("CORS_ORIGIN", "*")
    .split(",")
    .map((origin) => origin.trim());
  const credentials = getBooleanEnvVar("CORS_CREDENTIALS", false);

  return {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, allow localhost with any port
      if (
        process.env.NODE_ENV === "development" &&
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      // Reject origin
      callback(new Error("Not allowed by CORS"));
    },
    credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Request-ID",
      "X-API-Key",
    ],
    exposedHeaders: ["X-Request-ID", "X-Total-Count", "X-Page-Count"],
    maxAge: 86400, // 24 hours
  };
}

// ============================================================================
// Custom CORS Middleware
// ============================================================================

/**
 * Custom CORS middleware for additional control
 */
export function customCors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.headers.origin;
  const allowedOrigins = getEnvVar("CORS_ORIGIN", "*")
    .split(",")
    .map((o) => o.trim());

  // Set CORS headers
  if (
    allowedOrigins.includes("*") ||
    (origin && allowedOrigins.includes(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-ID, X-API-Key"
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "X-Request-ID, X-Total-Count, X-Page-Count"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle credentials
  const credentials = getBooleanEnvVar("CORS_CREDENTIALS", false);
  if (credentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
}

// ============================================================================
// Security Headers Middleware
// ============================================================================

/**
 * Add security headers to responses
 */
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self';"
  );

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  next();
}

// ============================================================================
// Request ID Middleware
// ============================================================================

/**
 * Add unique request ID to each request
 */
export function requestId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    (req.headers["x-request-id"] as string) ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  (req as any).requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
}

// ============================================================================
// Rate Limiting Headers
// ============================================================================

/**
 * Add rate limiting headers to responses
 */
export function rateLimitHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // These would be set by your rate limiting middleware
  const limit = res.getHeader("X-RateLimit-Limit");
  const remaining = res.getHeader("X-RateLimit-Remaining");
  const reset = res.getHeader("X-RateLimit-Reset");

  if (limit) {
    res.setHeader("X-RateLimit-Limit", limit);
  }
  if (remaining) {
    res.setHeader("X-RateLimit-Remaining", remaining);
  }
  if (reset) {
    res.setHeader("X-RateLimit-Reset", reset);
  }

  next();
}

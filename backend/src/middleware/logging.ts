/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Logging Middleware
 */

import { Request, Response, NextFunction } from "express";

// ============================================================================
// Log Levels
// ============================================================================

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

// ============================================================================
// Log Entry Interface
// ============================================================================

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

// ============================================================================
// Logger Class
// ============================================================================

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
    ];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex <= currentLevelIndex;
  }

  /**
   * Format log entry
   */
  private formatLogEntry(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty print for development
      return JSON.stringify(entry, null, 2);
    }

    // Compact format for production
    return JSON.stringify(entry);
  }

  /**
   * Write log entry
   */
  private writeLog(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    const formattedLog = this.formatLogEntry(entry);

    // In production, you would send this to a logging service
    // For now, we'll use console with appropriate levels
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
    }
  }

  /**
   * Log error
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.writeLog(LogLevel.ERROR, message, {
      ...metadata,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  /**
   * Log warning
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.writeLog(LogLevel.WARN, message, metadata);
  }

  /**
   * Log info
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.writeLog(LogLevel.INFO, message, metadata);
  }

  /**
   * Log debug
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.writeLog(LogLevel.DEBUG, message, metadata);
  }
}

// Create singleton logger instance
export const logger = new Logger();

// ============================================================================
// Request Logging Middleware
// ============================================================================

/**
 * Log HTTP requests
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const requestId = (req as any).requestId;
  const userId = (req as any).user?.id;

  // Log request start
  logger.info("Request started", {
    requestId,
    userId,
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;

    logger.info("Request completed", {
      requestId,
      userId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
    });

    return originalEnd.call(this, chunk, encoding);
  };

  next();
}

// ============================================================================
// Error Logging Middleware
// ============================================================================

/**
 * Log errors with context
 */
export function errorLogger(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req as any).requestId;
  const userId = (req as any).user?.id;

  logger.error("Request error", error, {
    requestId,
    userId,
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(error);
}

// ============================================================================
// Performance Logging
// ============================================================================

/**
 * Log slow requests
 */
export function slowRequestLogger(threshold: number = 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const requestId = (req as any).requestId;

    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any) {
      const responseTime = Date.now() - startTime;

      if (responseTime > threshold) {
        logger.warn("Slow request detected", {
          requestId,
          method: req.method,
          url: req.url,
          responseTime: `${responseTime}ms`,
          threshold: `${threshold}ms`,
        });
      }

      return originalEnd.call(this, chunk, encoding);
    };

    next();
  };
}

// ============================================================================
// Database Query Logging
// ============================================================================

/**
 * Log database queries (for development)
 */
export function dbQueryLogger(
  query: string,
  params?: any[],
  duration?: number
): void {
  if (process.env.NODE_ENV === "development") {
    logger.debug("Database query", {
      query,
      params,
      duration: duration ? `${duration}ms` : undefined,
    });
  }
}

// ============================================================================
// External API Logging
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
    logger.error(`External API error (${service})`, error, metadata);
  } else {
    logger.info(`External API call (${service})`, metadata);
  }
}

// ============================================================================
// Business Logic Logging
// ============================================================================

/**
 * Log business events
 */
export function businessEventLogger(
  event: string,
  userId?: string,
  metadata?: Record<string, any>
): void {
  logger.info("Business event", {
    event,
    userId,
    ...metadata,
  });
}

// ============================================================================
// Security Event Logging
// ============================================================================

/**
 * Log security events
 */
export function securityEventLogger(
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  userId?: string,
  ip?: string,
  metadata?: Record<string, any>
): void {
  const logLevel =
    severity === "critical" || severity === "high"
      ? LogLevel.ERROR
      : LogLevel.WARN;

  if (logLevel === LogLevel.ERROR) {
    logger.error("Security event", undefined, {
      event,
      severity,
      userId,
      ip,
      ...metadata,
    });
  } else {
    logger.warn("Security event", {
      event,
      severity,
      userId,
      ip,
      ...metadata,
    });
  }
}

/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Main Server Entry Point
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  corsConfig,
  securityHeaders,
  requestId,
  rateLimitHeaders,
  requestLogger,
  errorLogger,
  errorHandler,
  notFoundHandler,
} from "./middleware";
import {
  authRoutes,
  billingRoutes,
  messagingRoutes,
  posRoutes,
} from "./routes";
import { logger } from "./middleware/logging";
import { getEnvVar, getNumberEnvVar, getBooleanEnvVar } from "./utils";

// Load environment variables
dotenv.config();

// ============================================================================
// Server Configuration
// ============================================================================

const app = express();
const PORT = getNumberEnvVar("PORT", 3001);
const HOST = getEnvVar("HOST", "localhost");
const NODE_ENV = getEnvVar("NODE_ENV", "development");

// ============================================================================
// Middleware Setup
// ============================================================================

// Security and CORS
app.use(securityHeaders);
app.use(cors(corsConfig()));
app.use(requestId);
app.use(rateLimitHeaders);

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(requestLogger);
app.use(errorLogger);

// ============================================================================
// Health Check Route
// ============================================================================

app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    services: {
      database: "connected", // TODO: Add actual database health check
      stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "not_configured",
      square: process.env.SQUARE_ACCESS_TOKEN ? "configured" : "not_configured",
      slicktext: process.env.SLICKTEXT_API_KEY
        ? "configured"
        : "not_configured",
      supabase: process.env.SUPABASE_URL ? "configured" : "not_configured",
    },
  };

  res.status(200).json(healthCheck);
});

// ============================================================================
// API Routes
// ============================================================================

// API version prefix
const API_PREFIX = "/api";

// Mount route modules
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/billing`, billingRoutes);
app.use(`${API_PREFIX}/messaging`, messagingRoutes);
app.use(`${API_PREFIX}/pos`, posRoutes);

// ============================================================================
// Root Route
// ============================================================================

app.get("/", (req, res) => {
  res.json({
    message: "Flying Fox Solutions - Backend API Boilerplate",
    version: process.env.npm_package_version || "1.0.0",
    environment: NODE_ENV,
    documentation: "/api/docs", // TODO: Add API documentation
    health: "/health",
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      billing: `${API_PREFIX}/billing`,
      messaging: `${API_PREFIX}/messaging`,
      pos: `${API_PREFIX}/pos`,
    },
  });
});

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================

const server = app.listen(PORT, HOST, () => {
  logger.info("Server started", {
    host: HOST,
    port: PORT,
    environment: NODE_ENV,
    node_version: process.version,
    pid: process.pid,
  });

  // Log available endpoints
  logger.info("Available endpoints", {
    health: `http://${HOST}:${PORT}/health`,
    api_root: `http://${HOST}:${PORT}${API_PREFIX}`,
    auth: `http://${HOST}:${PORT}${API_PREFIX}/auth`,
    billing: `http://${HOST}:${PORT}${API_PREFIX}/billing`,
    messaging: `http://${HOST}:${PORT}${API_PREFIX}/messaging`,
    pos: `http://${HOST}:${PORT}${API_PREFIX}/pos`,
  });

  // Log configuration status
  logger.info("Service configuration status", {
    stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "not_configured",
    square: process.env.SQUARE_ACCESS_TOKEN ? "configured" : "not_configured",
    slicktext: process.env.SLICKTEXT_API_KEY ? "configured" : "not_configured",
    supabase: process.env.SUPABASE_URL ? "configured" : "not_configured",
  });
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    logger.info("HTTP server closed");

    // Close database connections, etc.
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ============================================================================
// Uncaught Exception Handler
// ============================================================================

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  process.exit(1);
});

export default app;

/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Middleware Barrel Export
 */

// Error handling
export {
  errorHandler,
  wrapAsync,
  notFoundHandler,
  developmentErrorHandler,
} from "./errorHandler";

// Validation
export {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateLogin,
  validateSignup,
  validateCheckout,
  validateSendSMS,
  validateCreateOrder,
  validateSchema,
  sanitizeBody,
  validatePagination,
} from "./validation";

// CORS and security
export {
  corsConfig,
  customCors,
  securityHeaders,
  requestId,
  rateLimitHeaders,
} from "./cors";

// Logging
export {
  logger,
  LogLevel,
  requestLogger,
  errorLogger,
  slowRequestLogger,
  dbQueryLogger,
  externalApiLogger,
  businessEventLogger,
  securityEventLogger,
} from "./logging";

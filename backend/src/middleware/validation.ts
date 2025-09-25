/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Validation Middleware
 */

import { Request, Response, NextFunction } from "express";
import { createValidationError, createApiError } from "../utils";
import {
  LoginRequest,
  SignupRequest,
  CheckoutRequest,
  SendSMSRequest,
  CreateOrderRequest,
} from "../types";

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Basic validation middleware
 * Validates required fields and basic format
 */
export function validateRequired(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    fields.forEach((field) => {
      if (!req.body[field] || req.body[field] === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw createValidationError(
        `Missing required fields: ${missingFields.join(", ")}`,
        { missingFields }
      );
    }

    next();
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// ============================================================================
// Authentication Validation
// ============================================================================

/**
 * Validate login request
 */
export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, password } = req.body as LoginRequest;

  if (!email || !password) {
    throw createValidationError("Email and password are required");
  }

  if (!validateEmail(email)) {
    throw createValidationError("Invalid email format");
  }

  if (password.length < 8) {
    throw createValidationError("Password must be at least 8 characters long");
  }

  next();
}

/**
 * Validate signup request
 */
export function validateSignup(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, password, firstName, lastName } = req.body as SignupRequest;

  if (!email || !password || !firstName || !lastName) {
    throw createValidationError(
      "Email, password, first name, and last name are required"
    );
  }

  if (!validateEmail(email)) {
    throw createValidationError("Invalid email format");
  }

  if (!validatePassword(password)) {
    throw createValidationError(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    );
  }

  if (firstName.length < 2) {
    throw createValidationError(
      "First name must be at least 2 characters long"
    );
  }

  if (lastName.length < 2) {
    throw createValidationError("Last name must be at least 2 characters long");
  }

  next();
}

// ============================================================================
// Billing Validation
// ============================================================================

/**
 * Validate checkout request
 */
export function validateCheckout(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { planId, email, paymentMethod } = req.body as CheckoutRequest;

  if (!planId || !email || !paymentMethod) {
    throw createValidationError(
      "Plan ID, email, and payment method are required"
    );
  }

  if (!validateEmail(email)) {
    throw createValidationError("Invalid email format");
  }

  if (!paymentMethod.type) {
    throw createValidationError("Payment method type is required");
  }

  const validPaymentTypes = ["card", "cash", "check", "digital_wallet"];
  if (!validPaymentTypes.includes(paymentMethod.type)) {
    throw createValidationError(
      `Invalid payment method type. Must be one of: ${validPaymentTypes.join(
        ", "
      )}`
    );
  }

  next();
}

// ============================================================================
// Messaging Validation
// ============================================================================

/**
 * Validate SMS send request
 */
export function validateSendSMS(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { content, recipients } = req.body as SendSMSRequest;

  if (!content || !recipients) {
    throw createValidationError("Content and recipients are required");
  }

  if (content.length === 0) {
    throw createValidationError("Message content cannot be empty");
  }

  if (content.length > 1600) {
    throw createValidationError(
      "Message content cannot exceed 1600 characters"
    );
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw createValidationError("Recipients must be a non-empty array");
  }

  if (recipients.length > 1000) {
    throw createValidationError(
      "Cannot send to more than 1000 recipients at once"
    );
  }

  // Validate phone numbers
  const invalidPhones = recipients.filter((phone) => !validatePhone(phone));
  if (invalidPhones.length > 0) {
    throw createValidationError(
      `Invalid phone numbers: ${invalidPhones.join(", ")}`
    );
  }

  next();
}

// ============================================================================
// POS Validation
// ============================================================================

/**
 * Validate create order request
 */
export function validateCreateOrder(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { items, paymentMethod } = req.body as CreateOrderRequest;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createValidationError("Order must contain at least one item");
  }

  if (!paymentMethod || !paymentMethod.type) {
    throw createValidationError("Payment method is required");
  }

  // Validate each item
  items.forEach((item, index) => {
    if (!item.product || !item.product.id) {
      throw createValidationError(`Item ${index + 1}: Product ID is required`);
    }

    if (!item.quantity || item.quantity <= 0) {
      throw createValidationError(
        `Item ${index + 1}: Quantity must be greater than 0`
      );
    }

    if (!item.product.price || item.product.price < 0) {
      throw createValidationError(
        `Item ${index + 1}: Product price must be valid`
      );
    }
  });

  // Validate payment method
  const validPaymentTypes = ["card", "cash", "check", "digital_wallet"];
  if (!validPaymentTypes.includes(paymentMethod.type)) {
    throw createValidationError(
      `Invalid payment method type. Must be one of: ${validPaymentTypes.join(
        ", "
      )}`
    );
  }

  next();
}

// ============================================================================
// Generic Validation Middleware
// ============================================================================

/**
 * Validate request body against schema
 */
export function validateSchema(
  schema: Record<string, (value: any) => boolean>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    Object.entries(schema).forEach(([field, validator]) => {
      if (req.body[field] !== undefined && !validator(req.body[field])) {
        errors.push(`Invalid ${field}`);
      }
    });

    if (errors.length > 0) {
      throw createValidationError(`Validation failed: ${errors.join(", ")}`);
    }

    next();
  };
}

/**
 * Sanitize request body
 */
export function sanitizeBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.body && typeof req.body === "object") {
    // Basic XSS protection - remove script tags and dangerous characters
    const sanitizeValue = (value: any): any => {
      if (typeof value === "string") {
        return value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, "");
      }
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      if (value && typeof value === "object") {
        const sanitized: any = {};
        Object.keys(value).forEach((key) => {
          sanitized[key] = sanitizeValue(value[key]);
        });
        return sanitized;
      }
      return value;
    };

    req.body = sanitizeValue(req.body);
  }

  next();
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1) {
    throw createValidationError("Page must be greater than 0");
  }

  if (limit < 1 || limit > 100) {
    throw createValidationError("Limit must be between 1 and 100");
  }

  // Add validated pagination to request
  (req as any).pagination = { page, limit };

  next();
}

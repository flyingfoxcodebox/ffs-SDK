/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Global Types and Interfaces
 */

import { Request } from "express";

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  CUSTOMER = "customer",
  EMPLOYEE = "employee",
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

// ============================================================================
// Billing & Subscription Types
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface CheckoutRequest {
  planId: string;
  email: string;
  paymentMethod: PaymentMethod;
  customerInfo?: CustomerInfo;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "cash" | "check" | "digital_wallet";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  name?: string;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ============================================================================
// Messaging & SMS Types
// ============================================================================

export interface SMSMessage {
  id: string;
  content: string;
  recipient: string;
  status: MessageStatus;
  segments: number;
  cost: number;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
}

export enum MessageStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface SendSMSRequest {
  content: string;
  recipients: string[];
  campaignName?: string;
  scheduledFor?: Date;
  listId?: string; // API v2 requires list ID
}

export interface Contact {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// POS & E-commerce Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  sku?: string;
  stock?: number;
  isAvailable?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  discountCode?: string;
  customerInfo?: CustomerInfo;
  paymentMethod?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface CreateOrderRequest {
  items: CartItem[];
  customerInfo?: CustomerInfo;
  discountCode?: string;
  paymentMethod: PaymentMethod;
}

// ============================================================================
// Express Request Extensions
// ============================================================================

export interface AuthenticatedRequest extends Request {
  user?: User;
  requestId?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  details?: any;
}

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  external: {
    stripe?: {
      secretKey: string;
      publishableKey: string;
      webhookSecret: string;
    };
    square?: {
      applicationId: string;
      accessToken: string;
      environment: string;
    };
    slicktext?: {
      apiKey: string;
      accountId: string;
      baseUrl: string;
    };
    supabase?: {
      url: string;
      anonKey: string;
      serviceRoleKey: string;
    };
  };
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface ExternalApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  headers?: Record<string, string>;
}

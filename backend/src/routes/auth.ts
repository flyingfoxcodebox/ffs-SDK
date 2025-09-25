/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Authentication Routes
 */

import { Router } from "express";
import { AuthController } from "../controllers";
import {
  validateLogin,
  validateSignup,
  validateRequired,
  wrapAsync,
} from "../middleware";

const router = Router();

// ============================================================================
// Public Routes
// ============================================================================

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validateSignup, wrapAsync(AuthController.signup));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", validateLogin, wrapAsync(AuthController.login));

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh authentication token
 * @access  Public
 */
router.post(
  "/refresh-token",
  validateRequired(["refreshToken"]),
  wrapAsync(AuthController.refreshToken)
);

/**
 * @route   POST /api/auth/request-password-reset
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  "/request-password-reset",
  validateRequired(["email"]),
  wrapAsync(AuthController.requestPasswordReset)
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  "/reset-password",
  validateRequired(["token", "newPassword"]),
  wrapAsync(AuthController.resetPassword)
);

// ============================================================================
// Protected Routes
// ============================================================================

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  "/profile",
  // TODO: Add authentication middleware
  wrapAsync(AuthController.getProfile)
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  // TODO: Add authentication middleware
  wrapAsync(AuthController.updateProfile)
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  "/change-password",
  // TODO: Add authentication middleware
  validateRequired(["currentPassword", "newPassword"]),
  wrapAsync(AuthController.changePassword)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  "/logout",
  // TODO: Add authentication middleware
  wrapAsync(AuthController.logout)
);

export default router;

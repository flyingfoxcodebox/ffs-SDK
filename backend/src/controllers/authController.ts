/**
 * Flying Fox Solutions - Backend API Boilerplate
 * Authentication Controller
 */

import { Request, Response, NextFunction } from "express";
import {
  AuthenticatedRequest,
  LoginRequest,
  SignupRequest,
  AuthTokens,
  UserRole,
} from "../types";
import { supabaseService } from "../services";
import {
  formatSuccessResponse,
  createAuthError,
  createValidationError,
  businessEventLogger,
  securityEventLogger,
} from "../utils";

// ============================================================================
// Authentication Controller
// ============================================================================

export class AuthController {
  /**
   * User signup
   */
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, firstName, lastName, role } = req.body as SignupRequest;

      // Check if user already exists
      const existingUser = await supabaseService.getUserByEmail(email);
      if (existingUser.success) {
        throw createValidationError("User with this email already exists");
      }

      // Create user in database
      const userResult = await supabaseService.createUser({
        email,
        firstName,
        lastName,
        role: role || UserRole.USER,
      });

      if (!userResult.success || !userResult.data) {
        throw createValidationError("Failed to create user account");
      }

      // Create authentication session
      const sessionResult = await supabaseService.createSession(
        userResult.data.id
      );
      if (!sessionResult.success) {
        throw createAuthError("Failed to create user session");
      }

      // Log business event
      businessEventLogger("user_signup", userResult.data.id, {
        email: userResult.data.email,
        role: userResult.data.role,
      });

      // Return success response
      const response = formatSuccessResponse(
        {
          user: userResult.data,
          tokens: sessionResult.data,
        },
        "User account created successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   */
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      // Authenticate user
      const authResult = await supabaseService.authenticateUser(
        email,
        password
      );
      if (!authResult.success) {
        securityEventLogger("login_failed", "medium", undefined, req.ip, {
          email,
          reason: "invalid_credentials",
        });
        throw createAuthError("Invalid email or password");
      }

      const user = authResult.data;
      if (!user) {
        throw createAuthError("User data not found");
      }

      // Check if user is active
      if (!user.isActive) {
        securityEventLogger(
          "login_attempt_inactive_user",
          "medium",
          user.id,
          req.ip,
          {
            email: user.email,
          }
        );
        throw createAuthError("Account is deactivated");
      }

      // Create session
      const sessionResult = await supabaseService.createSession(user.id);
      if (!sessionResult.success) {
        throw createAuthError("Failed to create session");
      }

      // Log successful login
      businessEventLogger("user_login", user.id, {
        email: user.email,
        role: user.role,
      });

      // Return success response
      const response = formatSuccessResponse(
        {
          user,
          tokens: sessionResult.data,
        },
        "Login successful",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createAuthError("User not authenticated");
      }

      // Get user from database
      const userResult = await supabaseService.getUserById(userId);
      if (!userResult.success) {
        throw createAuthError("Failed to retrieve user profile");
      }

      // Return user profile
      const response = formatSuccessResponse(
        userResult.data,
        "User profile retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createAuthError("User not authenticated");
      }

      const { firstName, lastName, email } = req.body;

      // Update user in database
      const updateResult = await supabaseService.updateUser(userId, {
        firstName,
        lastName,
        email,
      });

      if (!updateResult.success) {
        throw createValidationError("Failed to update user profile");
      }

      // Log profile update
      businessEventLogger("user_profile_updated", userId, {
        fields_updated: { firstName, lastName, email },
      });

      // Return updated profile
      const response = formatSuccessResponse(
        updateResult.data,
        "Profile updated successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createAuthError("User not authenticated");
      }

      const { newPassword } = req.body;

      // Validate new password
      if (!newPassword || newPassword.length < 8) {
        throw createValidationError(
          "New password must be at least 8 characters long"
        );
      }

      // TODO: Implement password change logic with Supabase
      // For now, we'll just log the event
      businessEventLogger("password_change_attempt", userId, {
        success: true, // This would be determined by actual password verification
      });

      // Return success response
      const response = formatSuccessResponse(
        null,
        "Password changed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createAuthError("User not authenticated");
      }

      // TODO: Implement logout logic with Supabase
      // This would typically involve invalidating the session/token

      // Log logout event
      businessEventLogger("user_logout", userId);

      // Return success response
      const response = formatSuccessResponse(
        null,
        "Logout successful",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createValidationError("Refresh token is required");
      }

      // TODO: Implement token refresh logic with Supabase
      // This would typically involve validating the refresh token and issuing a new access token

      // Mock response for now
      const mockTokens: AuthTokens = {
        accessToken: `access_token_${Date.now()}`,
        refreshToken: `refresh_token_${Date.now()}`,
        expiresIn: 3600,
      };

      // Return new tokens
      const response = formatSuccessResponse(
        mockTokens,
        "Token refreshed successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw createValidationError("Email is required");
      }

      // Check if user exists
      const userResult = await supabaseService.getUserByEmail(email);
      if (!userResult.success) {
        // Don't reveal if user exists or not for security
        const response = formatSuccessResponse(
          null,
          "If an account with that email exists, a password reset link has been sent",
          (req as any).requestId
        );
        res.status(200).json(response);
        return;
      }

      // TODO: Implement password reset logic
      // This would typically involve generating a reset token and sending an email

      // Log password reset request
      if (userResult.data) {
        securityEventLogger(
          "password_reset_requested",
          "medium",
          userResult.data.id,
          req.ip,
          {
            email: userResult.data.email,
          }
        );
      }

      // Return success response
      const response = formatSuccessResponse(
        null,
        "If an account with that email exists, a password reset link has been sent",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw createValidationError("Token and new password are required");
      }

      if (newPassword.length < 8) {
        throw createValidationError(
          "New password must be at least 8 characters long"
        );
      }

      // TODO: Implement password reset logic
      // This would typically involve validating the reset token and updating the password

      // Log password reset
      securityEventLogger(
        "password_reset_completed",
        "medium",
        undefined,
        req.ip,
        {
          token_used: token,
        }
      );

      // Return success response
      const response = formatSuccessResponse(
        null,
        "Password reset successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

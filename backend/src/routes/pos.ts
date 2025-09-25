/**
 * Flying Fox Solutions - Backend API Boilerplate
 * POS Routes
 */

import { Router } from "express";
import { POSController } from "../controllers";
import {
  validateCreateOrder,
  validateRequired,
  wrapAsync,
} from "../middleware";

const router = Router();

// ============================================================================
// Public Routes
// ============================================================================

/**
 * @route   GET /api/pos/products
 * @desc    Get products
 * @access  Public
 */
router.get("/products", wrapAsync(POSController.getProducts));

/**
 * @route   GET /api/pos/products/:productId
 * @desc    Get product by ID
 * @access  Public
 */
router.get("/products/:productId", wrapAsync(POSController.getProduct));

/**
 * @route   GET /api/pos/inventory
 * @desc    Get inventory status
 * @access  Public
 */
router.get("/inventory", wrapAsync(POSController.getInventoryStatus));

// ============================================================================
// Protected Routes
// ============================================================================

/**
 * @route   POST /api/pos/orders
 * @desc    Create order
 * @access  Private
 */
router.post(
  "/orders",
  // TODO: Add authentication middleware
  validateCreateOrder,
  wrapAsync(POSController.createOrder)
);

/**
 * @route   GET /api/pos/orders/:orderId
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  "/orders/:orderId",
  // TODO: Add authentication middleware
  wrapAsync(POSController.getOrder)
);

/**
 * @route   GET /api/pos/orders
 * @desc    Get orders by user
 * @access  Private
 */
router.get(
  "/orders",
  // TODO: Add authentication middleware
  wrapAsync(POSController.getOrders)
);

/**
 * @route   PUT /api/pos/orders/:orderId/status
 * @desc    Update order status
 * @access  Private
 */
router.put(
  "/orders/:orderId/status",
  // TODO: Add authentication middleware
  validateRequired(["status"]),
  wrapAsync(POSController.updateOrderStatus)
);

/**
 * @route   GET /api/pos/analytics
 * @desc    Get order analytics
 * @access  Private
 */
router.get(
  "/analytics",
  // TODO: Add authentication middleware
  wrapAsync(POSController.getOrderAnalytics)
);

/**
 * @route   PUT /api/pos/inventory/:productId
 * @desc    Update product inventory
 * @access  Private
 */
router.put(
  "/inventory/:productId",
  // TODO: Add authentication middleware
  validateRequired(["quantity", "operation"]),
  wrapAsync(POSController.updateInventory)
);

export default router;

/**
 * Flying Fox Solutions - Backend API Boilerplate
 * POS Controller
 */

import { Request, Response, NextFunction } from "express";
import {
  AuthenticatedRequest,
  CreateOrderRequest,
  Order,
  Product,
} from "../types";
import { squareService, supabaseService } from "../services";
import {
  formatSuccessResponse,
  createValidationError,
  createNotFoundError,
  businessEventLogger,
  securityEventLogger,
} from "../utils";

// ============================================================================
// POS Controller
// ============================================================================

export class POSController {
  /**
   * Get products
   */
  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const search = req.query.search as string;

      // TODO: Get products from database
      // For now, return mock data
      const mockProducts: Product[] = [
        {
          id: "product_1",
          name: "Coffee - Espresso",
          description: "Rich, full-bodied espresso",
          price: 2.5,
          category: "beverages",
          imageUrl: "https://example.com/images/espresso.jpg",
          sku: "COFFEE-ESP-001",
          stock: 100,
          isAvailable: true,
          tags: ["hot", "caffeine"],
        },
        {
          id: "product_2",
          name: "Croissant",
          description: "Buttery, flaky croissant",
          price: 3.25,
          category: "pastries",
          imageUrl: "https://example.com/images/croissant.jpg",
          sku: "PASTRY-CRO-001",
          stock: 25,
          isAvailable: true,
          tags: ["breakfast", "sweet"],
        },
        {
          id: "product_3",
          name: "Sandwich - Turkey Club",
          description: "Turkey, bacon, lettuce, tomato on sourdough",
          price: 8.95,
          category: "sandwiches",
          imageUrl: "https://example.com/images/turkey-club.jpg",
          sku: "SAND-TUR-001",
          stock: 15,
          isAvailable: true,
          tags: ["lunch", "protein"],
        },
      ];

      // Filter products based on query parameters
      let filteredProducts = mockProducts;

      if (category) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.category?.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      // Apply pagination
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);

      const response = formatSuccessResponse(
        {
          products: paginatedProducts,
          total: filteredProducts.length,
          limit,
          offset,
        },
        "Products retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   */
  static async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;

      if (!productId) {
        throw createValidationError("Product ID is required");
      }

      // TODO: Get product from database
      // For now, return mock data
      const mockProduct: Product = {
        id: productId,
        name: "Coffee - Espresso",
        description: "Rich, full-bodied espresso",
        price: 2.5,
        category: "beverages",
        imageUrl: "https://example.com/images/espresso.jpg",
        sku: "COFFEE-ESP-001",
        stock: 100,
        isAvailable: true,
        tags: ["hot", "caffeine"],
      };

      const response = formatSuccessResponse(
        mockProduct,
        "Product retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create order
   */
  static async createOrder(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { items, customerInfo, discountCode, paymentMethod } =
        req.body as CreateOrderRequest;

      // Validate order items
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw createValidationError("Order must contain at least one item");
      }

      // Calculate totals
      let subtotal = 0;
      const orderItems = items.map((item) => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        return {
          ...item,
          total: itemTotal,
        };
      });

      // Calculate tax (mock 8.5% tax rate)
      const taxRate = 0.085;
      const tax = subtotal * taxRate;

      // Calculate discount (mock 10% discount for demo)
      let discount = 0;
      if (discountCode === "SAVE10") {
        discount = subtotal * 0.1;
      }

      const total = subtotal + tax - discount;

      // Create order object
      const orderData: Partial<Order> = {
        items: orderItems,
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        discount: discount > 0 ? Math.round(discount * 100) / 100 : undefined,
        discountCode: discountCode || undefined,
        customerInfo,
        paymentMethod: paymentMethod.type,
        status: "pending",
      };

      // Save order to database
      const orderResult = await supabaseService.createOrder(orderData);
      if (!orderResult.success) {
        throw createValidationError("Failed to create order");
      }

      const order = orderResult.data;

      // Process payment
      const paymentResult = await squareService.processPayment(
        total,
        "USD",
        undefined, // sourceId would come from frontend
        order.id
      );

      if (!paymentResult.success) {
        // Update order status to failed
        await supabaseService.updateOrderStatus(order.id, "failed");
        throw createValidationError("Payment processing failed");
      }

      // Update order status to confirmed
      const updateResult = await supabaseService.updateOrderStatus(
        order.id,
        "confirmed"
      );
      if (!updateResult.success) {
        throw createValidationError("Failed to update order status");
      }

      // Log successful order
      businessEventLogger("order_created", userId, {
        order_id: order.id,
        total_amount: total,
        item_count: items.length,
        payment_method: paymentMethod.type,
        customer_email: customerInfo?.email,
      });

      const response = formatSuccessResponse(
        {
          order: updateResult.data,
          payment: paymentResult.data,
        },
        "Order created and payment processed successfully",
        (req as any).requestId
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   */
  static async getOrder(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { orderId } = req.params;

      if (!orderId) {
        throw createValidationError("Order ID is required");
      }

      // Get order from database
      const orderResult = await supabaseService.getOrderById(orderId);
      if (!orderResult.success) {
        throw createNotFoundError("Order");
      }

      const response = formatSuccessResponse(
        orderResult.data,
        "Order retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get orders by user
   */
  static async getOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get orders from database
      const ordersResult = await supabaseService.getOrdersByUserId(
        userId,
        limit,
        offset
      );
      if (!ordersResult.success) {
        throw createValidationError("Failed to retrieve orders");
      }

      const response = formatSuccessResponse(
        ordersResult.data,
        "Orders retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const { orderId } = req.params;
      const { status } = req.body;

      if (!orderId) {
        throw createValidationError("Order ID is required");
      }

      if (!status) {
        throw createValidationError("Status is required");
      }

      // Validate status
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ];
      if (!validStatuses.includes(status)) {
        throw createValidationError(
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
      }

      // Update order status in database
      const updateResult = await supabaseService.updateOrderStatus(
        orderId,
        status
      );
      if (!updateResult.success) {
        throw createNotFoundError("Order");
      }

      // Log status update
      businessEventLogger("order_status_updated", userId, {
        order_id: orderId,
        new_status: status,
        previous_status: "unknown", // Would need to get from database
      });

      const response = formatSuccessResponse(
        updateResult.data,
        "Order status updated successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order analytics
   */
  static async getOrderAnalytics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createValidationError("User authentication required");
      }

      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      // TODO: Get analytics from database
      // For now, return mock data
      const mockAnalytics = {
        totalOrders: 156,
        totalRevenue: 2847.5,
        averageOrderValue: 18.25,
        topProducts: [
          {
            productId: "product_1",
            name: "Coffee - Espresso",
            quantity: 89,
            revenue: 222.5,
          },
          {
            productId: "product_2",
            name: "Croissant",
            quantity: 67,
            revenue: 217.75,
          },
          {
            productId: "product_3",
            name: "Sandwich - Turkey Club",
            quantity: 34,
            revenue: 304.3,
          },
        ],
        ordersByStatus: {
          completed: 142,
          pending: 8,
          cancelled: 6,
        },
        revenueByDay: [
          { date: "2024-01-01", revenue: 245.5, orders: 14 },
          { date: "2024-01-02", revenue: 312.75, orders: 18 },
          { date: "2024-01-03", revenue: 198.25, orders: 12 },
        ],
        period: {
          startDate:
            startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
        },
      };

      const response = formatSuccessResponse(
        mockAnalytics,
        "Order analytics retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get inventory status
   */
  static async getInventoryStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // TODO: Get inventory from database
      // For now, return mock data
      const mockInventory = [
        {
          productId: "product_1",
          name: "Coffee - Espresso",
          currentStock: 100,
          lowStockThreshold: 20,
          status: "in_stock",
        },
        {
          productId: "product_2",
          name: "Croissant",
          currentStock: 25,
          lowStockThreshold: 10,
          status: "in_stock",
        },
        {
          productId: "product_3",
          name: "Sandwich - Turkey Club",
          currentStock: 5,
          lowStockThreshold: 10,
          status: "low_stock",
        },
      ];

      const response = formatSuccessResponse(
        mockInventory,
        "Inventory status retrieved successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product inventory
   */
  static async updateInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const { quantity, operation } = req.body; // operation: 'add', 'subtract', 'set'

      if (!productId) {
        throw createValidationError("Product ID is required");
      }

      if (quantity === undefined || quantity < 0) {
        throw createValidationError("Valid quantity is required");
      }

      if (!operation || !["add", "subtract", "set"].includes(operation)) {
        throw createValidationError(
          "Operation must be one of: add, subtract, set"
        );
      }

      // TODO: Update inventory in database
      // For now, return mock success
      const mockUpdate = {
        productId,
        previousQuantity: 100,
        newQuantity:
          operation === "add"
            ? 100 + quantity
            : operation === "subtract"
            ? 100 - quantity
            : quantity,
        operation,
        updatedAt: new Date().toISOString(),
      };

      // Log inventory update
      businessEventLogger("inventory_updated", undefined, {
        product_id: productId,
        operation,
        quantity_change: quantity,
        new_quantity: mockUpdate.newQuantity,
      });

      const response = formatSuccessResponse(
        mockUpdate,
        "Inventory updated successfully",
        (req as any).requestId
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

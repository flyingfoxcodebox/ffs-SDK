/**
 * POS Blueprint Starter - Usage Example
 *
 * This example demonstrates how to use the POS Blueprint components
 * in a real-world coffee shop application.
 */

import React from "react";
import {
  POSDashboard,
  Product,
  Order,
  PaymentMethod,
} from "@ffx/components/blueprints/pos";

// Sample coffee shop products
const coffeeShopProducts: Product[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Rich, full-bodied espresso shot",
    price: 2.5,
    category: "Coffee",
    sku: "ESP001",
    stock: 100,
    isAvailable: true,
    tags: ["hot", "coffee", "caffeine"],
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 3.75,
    category: "Coffee",
    sku: "CAP001",
    stock: 50,
    isAvailable: true,
    tags: ["hot", "coffee", "milk"],
  },
  {
    id: "3",
    name: "Latte",
    description: "Espresso with steamed milk and light foam",
    price: 4.25,
    category: "Coffee",
    sku: "LAT001",
    stock: 75,
    isAvailable: true,
    tags: ["hot", "coffee", "milk"],
  },
  {
    id: "4",
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice",
    price: 3.5,
    category: "Coffee",
    sku: "ICE001",
    stock: 60,
    isAvailable: true,
    tags: ["cold", "coffee"],
  },
  {
    id: "5",
    name: "Chocolate Croissant",
    description: "Buttery croissant filled with chocolate",
    price: 3.25,
    category: "Pastry",
    sku: "CRO001",
    stock: 25,
    isAvailable: true,
    tags: ["pastry", "chocolate", "sweet"],
  },
  {
    id: "6",
    name: "Blueberry Muffin",
    description: "Fresh baked muffin with blueberries",
    price: 2.95,
    category: "Pastry",
    sku: "MUF001",
    stock: 30,
    isAvailable: true,
    tags: ["pastry", "blueberry", "sweet"],
  },
  {
    id: "7",
    name: "Green Tea",
    description: "Premium loose leaf green tea",
    price: 2.75,
    category: "Tea",
    sku: "TEA001",
    stock: 80,
    isAvailable: true,
    tags: ["hot", "tea", "healthy"],
  },
  {
    id: "8",
    name: "Chai Latte",
    description: "Spiced tea with steamed milk",
    price: 4.5,
    category: "Tea",
    sku: "CHAI001",
    stock: 40,
    isAvailable: true,
    tags: ["hot", "tea", "spiced", "milk"],
  },
  {
    id: "9",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 3.95,
    category: "Beverage",
    sku: "OJUICE001",
    stock: 20,
    isAvailable: true,
    tags: ["cold", "juice", "fresh"],
  },
  {
    id: "10",
    name: "Chocolate Chip Cookie",
    description: "Homemade chocolate chip cookie",
    price: 1.95,
    category: "Pastry",
    sku: "COO001",
    stock: 45,
    isAvailable: true,
    tags: ["pastry", "chocolate", "sweet", "cookie"],
  },
];

/**
 * Coffee Shop POS Application
 *
 * This component demonstrates a complete coffee shop POS system
 * using the POS Blueprint components.
 */
export default function CoffeeShopPOS() {
  // Handle order completion
  const handleOrderComplete = async (order: Order) => {
    try {
      console.log("Order completed:", order);

      // In a real application, you would:
      // 1. Save order to database
      await saveOrderToDatabase(order);

      // 2. Print receipt
      await printReceipt(order);

      // 3. Send confirmation email if customer email provided
      if (order.customerInfo?.email) {
        await sendOrderConfirmation(order);
      }

      // 4. Update inventory
      await updateInventory(order);

      console.log("Order processing completed successfully");
    } catch (error) {
      console.error("Failed to process order:", error);
      // Handle error (show toast, retry, etc.)
    }
  };

  // Handle payment processing
  const handlePaymentProcess = async (
    order: Order,
    paymentMethod: PaymentMethod
  ) => {
    try {
      console.log("Processing payment:", { order, paymentMethod });

      // In a real application, you would integrate with a payment provider:
      // - Square: Use Square Web SDK
      // - Stripe: Use Stripe Elements
      // - PayPal: Use PayPal SDK

      // Example Square integration:
      // const { result } = await paymentsApi.createPayment({
      //   sourceId: paymentMethod.id,
      //   amountMoney: {
      //     amount: Math.round(order.total * 100),
      //     currency: 'USD'
      //   },
      //   orderId: order.id
      // });

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Payment processed successfully");
    } catch (error) {
      console.error("Payment processing failed:", error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Handle product updates (inventory management)
  const handleProductUpdate = (product: Product) => {
    console.log("Product updated:", product);

    // In a real application, you would:
    // 1. Update product in database
    // 2. Sync with inventory management system
    // 3. Update pricing if needed
    // 4. Notify other POS terminals if multi-location
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <POSDashboard
        products={coffeeShopProducts}
        onOrderComplete={handleOrderComplete}
        onPaymentProcess={handlePaymentProcess}
        onProductUpdate={handleProductUpdate}
      />
    </div>
  );
}

// Mock functions for demonstration
async function saveOrderToDatabase(order: Order): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Order saved to database:", order.id);
}

async function printReceipt(order: Order): Promise<void> {
  // Simulate receipt printing
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("Receipt printed for order:", order.id);
}

async function sendOrderConfirmation(order: Order): Promise<void> {
  // Simulate email sending
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Confirmation email sent to:", order.customerInfo?.email);
}

async function updateInventory(order: Order): Promise<void> {
  // Simulate inventory update
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log("Inventory updated for order:", order.id);
}

/**
 * Advanced POS Configuration Example
 *
 * This example shows how to customize the POS system for different
 * business types and requirements.
 */
export function AdvancedPOSExample() {
  const handleOrderComplete = (order: Order) => {
    // Custom business logic
    if (order.total > 50) {
      // Apply loyalty points for large orders
      console.log("Applying loyalty points for large order");
    }

    if (order.customerInfo?.email) {
      // Send marketing email for future orders
      console.log("Adding customer to marketing list");
    }
  };

  const handlePaymentProcess = async (
    order: Order,
    paymentMethod: PaymentMethod
  ) => {
    // Custom payment validation
    if (paymentMethod.type === "cash" && order.total > 100) {
      // Require manager approval for large cash transactions
      console.log("Large cash transaction - requiring manager approval");
    }

    // Process payment with custom business rules
    console.log("Processing payment with custom rules");
  };

  return (
    <POSDashboard
      products={coffeeShopProducts}
      onOrderComplete={handleOrderComplete}
      onPaymentProcess={handlePaymentProcess}
      onProductUpdate={handleProductUpdate}
    />
  );
}

/**
 * Multi-Location POS Example
 *
 * This example demonstrates how to use the POS system across
 * multiple store locations with location-specific configurations.
 */
export function MultiLocationPOSExample() {
  const [currentLocation, setCurrentLocation] = React.useState("main-street");

  const locationConfigs = {
    "main-street": {
      name: "Main Street Location",
      taxRate: 0.08,
      currency: "USD",
    },
    "mall-location": {
      name: "Mall Location",
      taxRate: 0.075,
      currency: "USD",
    },
    "airport-location": {
      name: "Airport Location",
      taxRate: 0.09,
      currency: "USD",
    },
  };

  const handleOrderComplete = (order: Order) => {
    const config = locationConfigs[currentLocation];
    console.log(`Order completed at ${config.name}:`, order);

    // Location-specific processing
    if (currentLocation === "airport-location") {
      // Special handling for airport location
      console.log("Processing airport location order");
    }
  };

  return (
    <div>
      <div className="p-4 bg-white dark:bg-gray-800 border-b">
        <select
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {Object.entries(locationConfigs).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      <POSDashboard
        products={coffeeShopProducts}
        onOrderComplete={handleOrderComplete}
        onPaymentProcess={handlePaymentProcess}
      />
    </div>
  );
}

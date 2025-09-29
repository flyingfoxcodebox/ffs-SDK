import React, { useState } from "react";
// Import directly from the built files
import { POSDashboard } from "../dist/blueprints/index.es.js";
import type {
  Product,
  Order,
  PaymentMethod,
} from "../dist/blueprints/index.es.js";

// Mock product data for the demo
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Espresso",
    price: 3.5,
    category: "Coffee",
    isAvailable: true,
    description: "Rich, full-bodied espresso shot",
    imageUrl: "",
    tags: ["hot", "caffeine", "strong"],
  },
  {
    id: "2",
    name: "Cappuccino",
    price: 4.25,
    category: "Coffee",
    isAvailable: true,
    description: "Espresso with steamed milk and foam",
    imageUrl: "",
    tags: ["hot", "milk", "foam"],
  },
  {
    id: "3",
    name: "Latte",
    price: 4.75,
    category: "Coffee",
    isAvailable: true,
    description: "Espresso with steamed milk",
    imageUrl: "",
    tags: ["hot", "milk", "smooth"],
  },
  {
    id: "4",
    name: "Croissant",
    price: 2.95,
    category: "Pastry",
    isAvailable: true,
    description: "Buttery, flaky French pastry",
    imageUrl: "",
    tags: ["buttery", "flaky", "breakfast"],
  },
  {
    id: "5",
    name: "Muffin",
    price: 3.25,
    category: "Pastry",
    isAvailable: true,
    description: "Fresh baked blueberry muffin",
    imageUrl: "",
    tags: ["sweet", "blueberry", "fresh"],
  },
  {
    id: "6",
    name: "Sandwich",
    price: 8.99,
    category: "Food",
    isAvailable: true,
    description: "Turkey and cheese on artisan bread",
    imageUrl: "",
    tags: ["lunch", "turkey", "cheese"],
  },
  {
    id: "7",
    name: "Salad",
    price: 7.5,
    category: "Food",
    isAvailable: true,
    description: "Fresh mixed greens with vinaigrette",
    imageUrl: "",
    tags: ["healthy", "fresh", "greens"],
  },
  {
    id: "8",
    name: "Cookie",
    price: 1.95,
    category: "Dessert",
    isAvailable: true,
    description: "Chocolate chip cookie",
    imageUrl: "",
    tags: ["sweet", "chocolate", "cookie"],
  },
];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleProductUpdate = (updatedProduct: Product) => {
    console.log("Product updated:", updatedProduct);
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleOrderComplete = (order: Order) => {
    console.log("Order completed:", order);
    setOrders((prev) => [...prev, order]);

    // Show success message
    alert(
      `Order #${
        order.id
      } completed successfully!\nTotal: $${order.total.toFixed(2)}`
    );
  };

  const handlePaymentProcess = async (
    order: Order,
    paymentMethod: PaymentMethod
  ) => {
    console.log("Processing payment:", { order, paymentMethod });

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment success (in real app, this would call payment API)
    return { success: true, transactionId: `TXN-${Date.now()}` };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🦊 Flying Fox POS Demo
              </h1>
              <p className="text-sm text-gray-600">
                Point of Sale System powered by Flying Fox Solutions SDK
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Total Orders: {orders.length}
              </p>
              <p className="text-xs text-gray-500">SDK Version: 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* POS Dashboard */}
      <POSDashboard
        products={products}
        onProductUpdate={handleProductUpdate}
        onOrderComplete={handleOrderComplete}
        onPaymentProcess={handlePaymentProcess}
        className="min-h-screen"
      />

      {/* Footer */}
      <div className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600">
            <p>
              Built with <span className="text-red-500">♥</span> using{" "}
              <a
                href="https://github.com/your-org/cursor-sprint-templates"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                @ffx/cursor-sprint-templates
              </a>
            </p>
            <p className="mt-1">
              This demo showcases the POS blueprint from the Flying Fox
              Solutions SDK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

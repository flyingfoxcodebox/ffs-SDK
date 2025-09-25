/**
 * Flying Fox Solutions - Jest Test Setup
 *
 * Global test setup and configuration for all tests.
 */

import dotenv from "dotenv";
import { forceMockMode } from "../src/mocks/slicktextServiceWrapper";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.USE_MOCKS = "true";

// Global test setup
beforeAll(() => {
  // Force mock mode for all tests
  forceMockMode();

  console.log("🧪 Test environment initialized");
  console.log("📱 SlickText service: MOCK MODE");
});

// Global test cleanup
afterAll(() => {
  console.log("✅ All tests completed");
});

// Global error handling for tests
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

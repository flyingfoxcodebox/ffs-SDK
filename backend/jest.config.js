/**
 * Flying Fox Solutions - Jest Configuration
 *
 * Jest configuration for testing SlickText integration and other backend services.
 */

module.exports = {
  // Test environment
  testEnvironment: "node",

  // Test file patterns
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts",
  ],

  // TypeScript support
  preset: "ts-jest",

  // Module file extensions
  moduleFileExtensions: ["ts", "js", "json"],

  // Transform files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // Root directory
  rootDir: ".",

  // Test directory
  testDirectory: "tests",

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Files to include in coverage
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
  ],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Module name mapping for path aliases
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@mocks/(.*)$": "<rootDir>/src/mocks/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },

  // Global variables
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },

  // Test environment variables
  testEnvironmentOptions: {
    NODE_ENV: "test",
    USE_MOCKS: "true",
  },
};

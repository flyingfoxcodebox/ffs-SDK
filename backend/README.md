# Flying Fox Solutions - Backend API Boilerplate

A clean, modular Node.js/Express.js backend starter designed to work seamlessly with the frontend blueprints (Auth, Billing, Messaging, POS). This backend is lightweight but scalable, with clear extension points for future integrations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Environment variables configured

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── routes/                # API route definitions
│   │   ├── auth.ts           # Authentication routes
│   │   ├── billing.ts        # Billing & subscription routes
│   │   ├── messaging.ts      # SMS messaging routes
│   │   ├── pos.ts           # Point of Sale routes
│   │   └── index.ts         # Route exports
│   ├── controllers/          # Business logic controllers
│   │   ├── authController.ts
│   │   ├── billingController.ts
│   │   ├── messagingController.ts
│   │   ├── posController.ts
│   │   └── index.ts
│   ├── services/             # External API integrations
│   │   ├── stripe.ts        # Stripe payment processing
│   │   ├── square.ts        # Square payment processing
│   │   ├── slicktext.ts     # SlickText SMS service
│   │   ├── supabase.ts      # Supabase database
│   │   └── index.ts
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── validation.ts    # Request validation
│   │   ├── cors.ts         # CORS configuration
│   │   ├── logging.ts      # Request logging
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── index.ts        # Response formatters, helpers
│   └── types/               # TypeScript type definitions
│       └── index.ts        # Global types and interfaces
├── package.json
├── tsconfig.json
├── env.example
├── api-examples.http        # API testing examples
└── README.md
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=3001
HOST=localhost
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_CREDENTIALS=true

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_REFRESH_EXPIRES_IN=7d

# External Service Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SQUARE_APPLICATION_ID=sandbox-sq0idb-...
SQUARE_ACCESS_TOKEN=sandbox-sq0atb-...
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=your_location_id

SLICKTEXT_API_KEY=your_slicktext_api_key
SLICKTEXT_ACCOUNT_ID=your_account_id
SLICKTEXT_BASE_URL=https://api.slicktext.com
SLICKTEXT_ENVIRONMENT=sandbox

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ENVIRONMENT=development
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Type checking
npm run type-check   # Run TypeScript compiler

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 📚 API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Billing & Subscriptions

- `GET /api/billing/plans` - Get subscription plans
- `POST /api/billing/checkout` - Process checkout
- `GET /api/billing/subscription` - Get current subscription
- `PUT /api/billing/subscription` - Update subscription
- `DELETE /api/billing/subscription/:id` - Cancel subscription
- `GET /api/billing/history` - Get billing history
- `GET /api/billing/payment-methods` - Get payment methods
- `POST /api/billing/payment-methods` - Add payment method
- `POST /api/billing/webhooks/stripe` - Stripe webhooks

### Messaging (SMS)

- `POST /api/messaging/send` - Send SMS message
- `GET /api/messaging/messages/:id/status` - Get message status
- `GET /api/messaging/messages/history` - Get message history
- `POST /api/messaging/contacts/upload` - Upload contacts
- `GET /api/messaging/contacts` - Get contacts
- `POST /api/messaging/contacts` - Add contact
- `POST /api/messaging/campaigns` - Create campaign
- `GET /api/messaging/campaigns` - Get campaigns
- `POST /api/messaging/auto-replies` - Create auto-reply
- `GET /api/messaging/auto-replies` - Get auto-replies
- `GET /api/messaging/account/balance` - Get account balance
- `POST /api/messaging/webhooks/slicktext` - SlickText webhooks

### Point of Sale (POS)

- `GET /api/pos/products` - Get products
- `GET /api/pos/products/:id` - Get product by ID
- `GET /api/pos/inventory` - Get inventory status
- `POST /api/pos/orders` - Create order
- `GET /api/pos/orders/:id` - Get order by ID
- `GET /api/pos/orders` - Get user orders
- `PUT /api/pos/orders/:id/status` - Update order status
- `GET /api/pos/analytics` - Get order analytics
- `PUT /api/pos/inventory/:id` - Update inventory

## 🔌 External Service Integrations

### Stripe (Payments)

- Payment processing
- Subscription management
- Webhook handling
- Customer management

### Square (Payments)

- Payment processing
- Order management
- Customer management
- Location management

### SlickText (SMS)

- SMS messaging
- Contact management
- Campaign management
- Auto-reply setup
- Webhook processing

### Supabase (Database)

- User management
- Order storage
- Contact storage
- Authentication

## 🧪 Testing

Use the provided `api-examples.http` file to test endpoints:

1. Start the server: `npm run dev`
2. Open `api-examples.http` in VS Code with REST Client extension
3. Update the `@authToken` variable with a valid JWT
4. Run individual requests or entire test suites

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Set up external service accounts (Stripe, Square, SlickText, Supabase)

### Build & Deploy

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Security Features

- CORS configuration
- Security headers (XSS protection, CSRF, etc.)
- Request validation
- Rate limiting headers
- JWT authentication
- Input sanitization
- Webhook signature verification

## 📊 Monitoring & Logging

- Structured logging with request IDs
- Error tracking and reporting
- Performance monitoring
- Security event logging
- Business event tracking

## 🔄 Webhook Handling

The API supports webhooks from:

- **Stripe**: Payment events, subscription changes
- **SlickText**: SMS delivery status, auto-reply triggers

Webhook endpoints automatically verify signatures and process events.

## 🛠️ Extension Points

### Adding New Services

1. Create service class in `src/services/`
2. Add configuration to environment variables
3. Implement service methods with mock responses
4. Add to service exports in `src/services/index.ts`

### Adding New Routes

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Add middleware for validation/authentication
4. Mount routes in `src/server.ts`

### Adding New Middleware

1. Create middleware file in `src/middleware/`
2. Export from `src/middleware/index.ts`
3. Apply in `src/server.ts` or individual routes

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include request validation
4. Add comprehensive logging
5. Update documentation
6. Test with provided examples

## 📄 License

This project is part of the Flying Fox Solutions template library.

## 🆘 Support

For questions or issues:

1. Check the API examples in `api-examples.http`
2. Review the comprehensive logging output
3. Verify environment variable configuration
4. Check external service status

---

**Note**: This is a boilerplate template. Replace mock implementations with actual service integrations for production use.

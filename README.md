# Flying Fox Template Library SDK

A comprehensive React + TypeScript SDK providing atomic components, blueprint modules, and integration services for building modern SaaS applications.

## 🚀 Quick Start

### Installation

```bash
npm install @ffx/cursor-sprint-templates
```

### Basic Usage

```tsx
import React from "react";
import { Button, InputField, Modal } from "@ffx/cursor-sprint-templates";
import { SupabaseIntegration } from "@ffx/cursor-sprint-templates/services";

function MyApp() {
  return (
    <div>
      <InputField label="Email" placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

## 📦 What's Included

### 🧱 Atomic Components

- **UI Components**: Button, InputField, Modal, Spinner, Toast, FormGroup
- **Auth Components**: LoginForm, SignUpForm, PasswordResetForm
- **Billing Components**: BillingDashboard, PaymentMethodForm, PlanSelector

### 🧪 Blueprint Modules

- **Messaging**: SMS/Email campaign management with SlickText integration
- **POS**: Point-of-sale system with cart, checkout, and payment processing
- **Auth**: Complete authentication flow with panels and forms
- **Billing**: Subscription management and payment processing
- **Consulting Site**: Full-stack consulting website template

### 🧰 Services & Integrations

- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **Square**: POS and payment processing
- **SlickText**: SMS marketing
- **HubSpot**: CRM integration
- **QuickBooks/Xero**: Accounting integration

### 🎣 Hooks

- **Messaging**: useMessaging, useContacts, useCampaigns
- **POS**: useCart, useProducts, useOrders
- **Billing**: useBillingData, useInvoices

## 🎯 Import Patterns

### Namespace Imports (Recommended)

```tsx
import { Button, InputField } from "@ffx/cursor-sprint-templates";
import { MessageComposer } from "@ffx/cursor-sprint-templates/blueprints";
import { useCart } from "@ffx/cursor-sprint-templates/hooks";
import { SupabaseIntegration } from "@ffx/cursor-sprint-templates/services";
```

### Direct Imports

```tsx
import {
  components,
  blueprints,
  hooks,
  services,
} from "@ffx/cursor-sprint-templates";

const { Button, InputField } = components;
const { MessageComposer } = blueprints.messaging;
const { useCart } = hooks;
const { SupabaseIntegration } = services;
```

## 🎨 Styling with Tailwind CSS v4

The SDK uses Tailwind CSS v4 for styling. Make sure your project is configured with Tailwind v4:

### Install Tailwind v4

```bash
npm install tailwindcss@^4.1.13 @tailwindcss/postcss@^4.1.13 autoprefixer
```

### Configure Tailwind

Create `tailwind.config.js`:

```js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@ffx/cursor-sprint-templates/**/*.{js,ts,jsx,tsx}",
  ],
};
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
```

### Import CSS

In your main CSS file:

```css
@import "tailwindcss";
@import "@ffx/cursor-sprint-templates/dist/cursor-sprint-templates.css";
```

## 🏗️ Blueprint Usage Examples

### Messaging Dashboard

```tsx
import { MessagingDashboard } from "@ffx/cursor-sprint-templates/blueprints";

function App() {
  return (
    <MessagingDashboard
      messages={messages}
      contacts={contacts}
      onSendMessage={handleSendMessage}
      onLoadContacts={loadContacts}
      loading={false}
    />
  );
}
```

### POS System

```tsx
import { POSDashboard } from "@ffx/cursor-sprint-templates/blueprints";
import { useCart } from "@ffx/cursor-sprint-templates/hooks";

function App() {
  const { items, addItem, removeItem } = useCart();

  return (
    <POSDashboard
      products={products}
      cart={items}
      onAddToCart={addItem}
      onRemoveFromCart={removeItem}
    />
  );
}
```

### Authentication

```tsx
import { AuthPanel } from "@ffx/cursor-sprint-templates/blueprints";

function App() {
  return (
    <AuthPanel
      mode="login"
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      loading={false}
    />
  );
}
```

## 🔧 Service Integration

### Supabase

```tsx
import { SupabaseIntegration } from "@ffx/cursor-sprint-templates/services";

const supabase = new SupabaseIntegration({
  url: "https://your-project.supabase.co",
  key: "your-anon-key",
});

// Use the client
const { data } = await supabase.client.from("users").select("*");
```

### Stripe

```tsx
import { StripeIntegration } from "@ffx/cursor-sprint-templates/services";

const stripe = new StripeIntegration({
  publishableKey: "pk_test_...",
  secretKey: "sk_test_...",
});

// Create payment intent
const paymentIntent = await stripe.createPaymentIntent({
  amount: 2000,
  currency: "usd",
});
```

## 🚧 Current Status

### ✅ Completed

- Core SDK structure and exports
- Tailwind CSS v4 integration
- TypeScript configuration
- Basic component architecture
- Service integration stubs

### 🔄 In Progress

- Internal import path fixes
- Component TypeScript error resolution
- Blueprint component testing
- Hook implementation validation

### 📋 Known Issues

- Some components have internal `@ffx/` imports that need to be converted to relative imports
- TypeScript strict mode errors in some components
- Blueprint components need testing and validation

## 🤝 Contributing

This SDK is part of the Flying Fox Solutions template library. Components are designed to be:

1. **Atomic**: Single-purpose, reusable components
2. **Composable**: Can be combined to build complex UIs
3. **Accessible**: ARIA-compliant and keyboard navigable
4. **Responsive**: Mobile-first design with Tailwind CSS
5. **Type-safe**: Full TypeScript support with proper type exports

## 📄 License

Proprietary - Flying Fox Solutions

## 🆘 Support

For issues and questions, please contact the Flying Fox Solutions development team.

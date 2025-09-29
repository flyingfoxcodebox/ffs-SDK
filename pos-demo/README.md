# POS Demo - Flying Fox Solutions SDK

This is a standalone demo application that showcases the Point of Sale (POS) system built using the Flying Fox Solutions SDK.

## 🚀 Features

- **Complete POS System**: Browse products, manage cart, process payments
- **Real-time Updates**: Live product inventory and order management
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling (via SDK)
- **@ffx/cursor-sprint-templates** - POS components and logic

## 📦 Installation

1. **Install dependencies:**

   ```bash
   cd pos-demo
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Product Management

- Browse available products in the main grid
- View product details and descriptions
- Add products to cart with custom quantities

### Shopping Cart

- Review selected items and quantities
- Apply discount codes (try "WELCOME10" for 10% off)
- Update quantities or remove items
- Clear entire cart

### Checkout Process

1. **Review Order**: Check items, quantities, and totals
2. **Customer Info**: Enter customer details (optional)
3. **Payment**: Select payment method and process

### Order Management

- View completed orders in the system
- Track order history and totals
- Simulate payment processing

## 🧪 Demo Data

The demo includes sample products:

- **Coffee**: Espresso, Cappuccino, Latte
- **Pastries**: Croissant, Muffin
- **Food**: Sandwich, Salad
- **Desserts**: Cookie

## 🔧 Customization

### Adding Products

Modify the `mockProducts` array in `App.tsx`:

```typescript
const mockProducts: Product[] = [
  {
    id: "unique-id",
    name: "Product Name",
    price: 9.99,
    category: "Category",
    isAvailable: true,
    description: "Product description",
    imageUrl: "optional-image-url",
    tags: ["tag1", "tag2"],
  },
];
```

### Payment Processing

Implement real payment processing in the `handlePaymentProcess` function:

```typescript
const handlePaymentProcess = async (
  order: Order,
  paymentMethod: PaymentMethod
) => {
  // Call your payment API
  const result = await processPayment(order, paymentMethod);
  return result;
};
```

## 📱 Responsive Design

The POS system is fully responsive:

- **Mobile**: Single column layout with touch-friendly controls
- **Tablet**: Two-column layout with sidebar cart
- **Desktop**: Three-column layout with full product grid

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG compliant color combinations

## 🎨 Theming

The system supports both light and dark modes:

- Automatic theme detection based on system preferences
- Manual theme switching available
- Consistent design system across all components

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📚 SDK Documentation

For more information about the Flying Fox Solutions SDK:

- [Component Documentation](../docs/)
- [API Reference](../docs/components/)
- [Integration Guides](../docs/integrations/)

## 🤝 Contributing

This demo is part of the Flying Fox Solutions template library. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This demo is part of the Flying Fox Solutions SDK and follows the same licensing terms.

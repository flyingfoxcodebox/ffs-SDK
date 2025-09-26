import { useState } from "react";
import { LoginForm, type HandleLogin } from "../components/auth";
import InputField from "@ffx/components/ui/InputField";
import Button from "@ffx/components/ui/Button";
import Modal from "@ffx/components/ui/Modal";
import Spinner from "@ffx/components/ui/Spinner";
import FormGroup from "@ffx/components/ui/FormGroup";
import Toast from "@ffx/components/ui/Toast";
import AuthPanel, {
  type LoginData,
  type SignUpData,
  type PasswordResetData,
} from "@ffx/components/blueprints/auth/AuthPanel";
import CheckoutPanel, {
  type SubscriptionPlan,
} from "@ffx/components/blueprints/billing/CheckoutPanel";
// Commented out unused billing components - can be uncommented when needed
// import {
//   BillingSummary,
//   PaymentMethodForm,
//   PlanSelector,
//   InvoiceList,
//   SubscriptionStatusBanner,
//   BillingDashboard,
// } from "@ffx/components/billing";
import { MessagingDashboard } from "@ffx/components/blueprints/messaging";
import { POSDashboard } from "@ffx/components/blueprints/pos";

const handleLogin: HandleLogin = async (email, password) => {
  await new Promise((r) => setTimeout(r, 700));
  console.log("Login attempted with:", email, password);
};

export default function App() {
  const [view] = useState<"login" | "signup" | "reset">("login");
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showCheckoutPanel, setShowCheckoutPanel] = useState(false);
  // const [showBillingDashboard, setShowBillingDashboard] = useState(false);
  const [showMessagingDashboard, setShowMessagingDashboard] = useState(false);
  const [showPOSDashboard, setShowPOSDashboard] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      variant: "success" | "error" | "info" | "warning";
      show: boolean;
    }>
  >([]);

  // ✅ Sample subscription plans
  const samplePlans: SubscriptionPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 0,
      currency: "USD",
      description: "Perfect for individuals getting started",
      billingCycle: "monthly",
      features: [
        "Up to 3 projects",
        "Community support",
        "Basic templates",
        "1GB storage",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: 19.99,
      currency: "USD",
      description: "Ideal for professionals and small teams",
      billingCycle: "monthly",
      features: [
        "Unlimited projects",
        "Priority email support",
        "Advanced templates",
        "10GB storage",
        "Team collaboration",
        "Analytics dashboard",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 49.99,
      currency: "USD",
      description: "For growing businesses and teams",
      billingCycle: "monthly",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Unlimited storage",
        "Advanced security",
        "API access",
        "White-label options",
      ],
    },
  ];

  // ✅ AuthPanel callback handlers
  const handleAuthLogin = async (data: LoginData) => {
    console.log("AuthPanel Login:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleAuthSignUp = async (data: SignUpData) => {
    console.log("AuthPanel SignUp:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleAuthPasswordReset = async (data: PasswordResetData) => {
    console.log("AuthPanel Password Reset:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleAuthRedirect = (path: string) => {
    console.log("AuthPanel Redirect to:", path);
    // In a real app, you would navigate to the path
  };

  // ✅ CheckoutPanel callback handlers
  const handleCheckout = async (
    planId: string,
    email: string,
    paymentMethod: string
  ) => {
    console.log("CheckoutPanel Checkout:", { planId, email, paymentMethod });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success/failure for demo
    if (Math.random() > 0.2) {
      console.log("✅ Checkout successful!");
    } else {
      throw new Error("Payment processing failed. Please try again.");
    }
  };

  // ✅ Billing Dashboard handlers - commented out unused handlers
  // const handleBillingSelectPlan = async (planId: string) => {
  //   console.log("Billing Dashboard - Plan selected:", planId);
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  // };

  // const handleBillingAddPaymentMethod = async (cardDetails: unknown) => {
  //   console.log("Billing Dashboard - Adding payment method:", cardDetails);
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  // };

  // const handleBillingUpdatePaymentMethod = async (cardDetails: unknown) => {
  //   console.log("Billing Dashboard - Updating payment method:", cardDetails);
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  // };

  // const handleBillingDownloadInvoice = (invoiceId: string) => {
  //   console.log("Billing Dashboard - Downloading invoice:", invoiceId);
  //   // Simulate download
  //   setTimeout(() => {
  //     console.log("Invoice downloaded successfully");
  //   }, 500);
  // };

  // const handleBillingUpgrade = () => {
  //   console.log("Billing Dashboard - Upgrading subscription");
  //   // Simulate redirect
  // };

  // const handleBillingRenew = () => {
  //   console.log("Billing Dashboard - Renewing subscription");
  //   // Simulate API call
  // };

  // const handleBillingReactivate = () => {
  //   console.log("Billing Dashboard - Reactivating subscription");
  //   // Simulate API call
  // };

  // const handleBillingCancel = () => {
  //   console.log("Billing Dashboard - Cancelling subscription");
  //   // Simulate API call
  // };

  if (showAuthPanel) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-6">
        <div className="w-full max-w-md">
          <AuthPanel
            onLogin={handleAuthLogin}
            onSignUp={handleAuthSignUp}
            onPasswordReset={handleAuthPasswordReset}
            onRedirect={handleAuthRedirect}
            title="Flying Fox Solutions"
            subtitle="Complete authentication demo"
            showRememberMe={true}
          />

          <div className="mt-8 text-center">
            <Button variant="secondary" onClick={() => setShowAuthPanel(false)}>
              Back to Component Demos
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (showCheckoutPanel) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6">
        <div className="max-w-6xl mx-auto">
          <CheckoutPanel
            plans={samplePlans}
            onCheckout={handleCheckout}
            currency="$"
            testMode={true}
            title="Choose Your Plan"
            subtitle="Select a subscription plan that fits your needs"
            showSummary={true}
          />

          <div className="mt-8 text-center">
            <Button
              variant="secondary"
              onClick={() => setShowCheckoutPanel(false)}
            >
              Back to Component Demos
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Commented out BillingDashboard section - can be uncommented when needed
  // if (showBillingDashboard) {
  //   return (
  //     <main className="min-h-screen bg-gray-100 dark:bg-gray-950">
  //       <BillingDashboard
  //         plans={samplePlans}
  //         onSelectPlan={handleBillingSelectPlan}
  //         onAddPaymentMethod={handleBillingAddPaymentMethod}
  //         onUpdatePaymentMethod={handleBillingUpdatePaymentMethod}
  //         onDownloadInvoice={handleBillingDownloadInvoice}
  //         onUpgrade={handleBillingUpgrade}
  //         onRenew={handleBillingRenew}
  //         onReactivate={handleBillingReactivate}
  //         onCancelSubscription={handleBillingCancel}
  //         title="Billing Dashboard"
  //         subtitle="Manage your subscription, payment methods, and billing history"
  //         showPlanSelector={true}
  //         showPaymentMethod={true}
  //         showInvoiceHistory={true}
  //       />
  //       <div className="fixed bottom-4 left-4">
  //         <Button
  //           variant="secondary"
  //           onClick={() => setShowBillingDashboard(false)}
  //         >
  //           Back to Component Demos
  //         </Button>
  //       </div>
  //     </main>
  //   );
  // }

  if (showMessagingDashboard) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <MessagingDashboard
          slickTextConfig={{
            apiKey: "demo-api-key",
            accountId: "demo-account",
            baseUrl: "https://api.slicktext.com/v1",
            sandboxMode: true,
          }}
          onConfigUpdate={(config: unknown) => {
            console.log("SlickText config updated:", config);
          }}
        />
        <div className="fixed bottom-4 left-4">
          <Button
            variant="secondary"
            onClick={() => setShowMessagingDashboard(false)}
          >
            Back to Component Demos
          </Button>
        </div>
      </main>
    );
  }

  if (showPOSDashboard) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <POSDashboard
          products={[]} // Use default mock products from useProducts hook
          onOrderComplete={(order: unknown) => {
            console.log("POS Order completed:", order);
          }}
          onPaymentProcess={async (order: unknown, paymentMethod: unknown) => {
            console.log("POS Payment processed:", { order, paymentMethod });
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        />
        <div className="fixed bottom-4 left-4">
          <Button
            variant="secondary"
            onClick={() => setShowPOSDashboard(false)}
          >
            Back to Component Demos
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center bg-gray-100 dark:bg-gray-950 p-6">
      {view === "login" && (
        <LoginForm
          handleLogin={handleLogin}
          forgotPasswordHref="#"
          title="Welcome back"
          subtitle="Sign in to your account"
        />
      )}

      {/* 🚀 Blueprint Demos */}
      <div className="mt-8 text-center space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🚀 Blueprint Components Demo
        </h2>

        {/* AuthPanel Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            🔐 AuthPanel Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete authentication flow combining all atomic components
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAuthPanel(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Try AuthPanel Blueprint
          </Button>
        </div>

        {/* CheckoutPanel Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            💳 CheckoutPanel Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete subscription checkout flow with plan selection and payment
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCheckoutPanel(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Try CheckoutPanel Blueprint
          </Button>
        </div>

        {/* BillingDashboard Demo - commented out */}
        {/* <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            💼 BillingDashboard Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete billing management dashboard with all components
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowBillingDashboard(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Try BillingDashboard Blueprint
          </Button>
        </div> */}

        {/* MessagingDashboard Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            📱 MessagingDashboard Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete SMS messaging system with SlickText integration
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowMessagingDashboard(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            Try MessagingDashboard Blueprint
          </Button>
        </div>

        {/* POSDashboard Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            🛒 POSDashboard Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete Point of Sale system with product catalog, cart, and
            checkout
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowPOSDashboard(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Try POSDashboard Blueprint
          </Button>
        </div>
      </div>

      {/* 🧪 Test InputField and Button components */}
      <div className="mt-8 w-full max-w-md space-y-6">
        <div>
          <InputField
            type="email"
            label="Test Email"
            value={testEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTestEmail(e.target.value)
            }
            placeholder="you@example.com"
            required
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Current state value: {testEmail}
          </p>
        </div>

        {/* Button Variants Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Button Variants
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">
              Primary
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="danger" size="sm">
              Danger
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
          </div>
        </div>

        {/* Button Sizes Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Button Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <Button fullWidth variant="secondary">
            Full Width Button
          </Button>
        </div>

        {/* Loading State Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Loading States
          </h3>
          <div className="flex gap-2">
            <Button
              loading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
            >
              {isLoading ? "Processing..." : "Start Loading"}
            </Button>
            <Button loading={true} variant="secondary">
              Always Loading
            </Button>
          </div>
        </div>

        {/* Modal Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Modal Examples
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Button variant="danger" onClick={() => setShowConfirmModal(true)}>
              Confirm Action
            </Button>
          </div>
        </div>

        {/* Spinner Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Spinner Examples
          </h3>

          {/* Spinner Sizes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sizes
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Spinner size="sm" aria-label="Small loading" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Small
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size="md" aria-label="Medium loading" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Medium
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size="lg" aria-label="Large loading" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Large
                </span>
              </div>
            </div>
          </div>

          {/* Spinner Colors */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Colors
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Spinner color="primary" aria-label="Primary loading" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Primary
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded">
                <Spinner color="white" aria-label="White loading" />
                <span className="text-sm text-white">White</span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner color="gray" aria-label="Gray loading" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Gray
                </span>
              </div>
            </div>
          </div>

          {/* Spinner in Context */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              In Context
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Spinner size="sm" color="gray" aria-label="Loading data" />
                Loading data...
              </div>
              <div className="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <Spinner
                    size="md"
                    color="primary"
                    aria-label="Processing request"
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Processing request...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FormGroup Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            FormGroup Examples
          </h3>

          <div className="space-y-4">
            {/* Basic FormGroup */}
            <FormGroup label="Basic Input">
              <InputField
                type="text"
                label=""
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
              />
            </FormGroup>

            {/* FormGroup with Description */}
            <FormGroup
              label="Email Address"
              description="We'll never share your email with anyone"
              required
            >
              <InputField
                type="email"
                label=""
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@example.com"
              />
            </FormGroup>

            {/* FormGroup with Error */}
            <FormGroup
              label="Message"
              description="Tell us how we can help you"
              error={formErrors.message}
              required
            >
              <InputField
                type="text"
                label=""
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Enter your message"
              />
            </FormGroup>

            {/* FormGroup with Select */}
            <FormGroup
              label="Country"
              description="Select your country of residence"
            >
              <select className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                <option value="">Choose a country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
              </select>
            </FormGroup>

            {/* FormGroup with Textarea */}
            <FormGroup
              label="Additional Comments"
              description="Any additional information you'd like to share"
            >
              <textarea
                rows={3}
                placeholder="Enter additional comments..."
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </FormGroup>

            {/* Demo Button */}
            <Button
              variant="primary"
              onClick={() => {
                // Simulate validation
                const errors: Record<string, string> = {};
                if (!formData.message) {
                  errors.message = "Message is required";
                }
                setFormErrors(errors);
                console.log("Form data:", formData);
              }}
            >
              Test FormGroup
            </Button>
          </div>
        </div>

        {/* Toast Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Toast Examples
          </h3>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toast Variants
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Success! Your action was completed.",
                      variant: "success",
                      show: true,
                    },
                  ]);
                }}
              >
                Success Toast
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Error! Something went wrong.",
                      variant: "error",
                      show: true,
                    },
                  ]);
                }}
              >
                Error Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Info: Here's some useful information.",
                      variant: "info",
                      show: true,
                    },
                  ]);
                }}
              >
                Info Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Warning: Please be careful!",
                      variant: "warning",
                      show: true,
                    },
                  ]);
                }}
              >
                Warning Toast
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-Dismiss Examples
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Quick success (3s)",
                      variant: "success",
                      show: true,
                    },
                  ]);
                  // Auto-remove after 3 seconds
                  setTimeout(() => {
                    setToasts((prev) =>
                      prev.filter((toast) => toast.id !== id)
                    );
                  }, 3000);
                }}
              >
                Quick Success (3s)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Long info (10s)",
                      variant: "info",
                      show: true,
                    },
                  ]);
                  // Auto-remove after 10 seconds
                  setTimeout(() => {
                    setToasts((prev) =>
                      prev.filter((toast) => toast.id !== id)
                    );
                  }, 10000);
                }}
              >
                Long Info (10s)
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const id = Date.now();
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: "Manual dismiss only - click X to close",
                      variant: "error",
                      show: true,
                    },
                  ]);
                  // No auto-remove - manual dismiss only
                }}
              >
                Manual Dismiss Only
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Stack Multiple Toasts
            </h4>
            <Button
              variant="primary"
              onClick={() => {
                const variants: Array<
                  "success" | "error" | "info" | "warning"
                > = ["success", "error", "info", "warning"];
                const messages = [
                  "First toast - success!",
                  "Second toast - error!",
                  "Third toast - info!",
                  "Fourth toast - warning!",
                ];

                variants.forEach((variant, index) => {
                  const id = Date.now() + index;
                  setToasts((prev) => [
                    ...prev,
                    {
                      id,
                      message: messages[index],
                      variant,
                      show: true,
                    },
                  ]);
                });
              }}
            >
              Show 4 Stacked Toasts
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Stack */}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          show={toast.show}
          onDismiss={() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
          className={`top-${4 + index * 20}`}
        />
      ))}

      {/* Modal Examples */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is an example modal with some content. You can close it by:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Clicking the X button in the header</li>
            <li>Pressing the ESC key</li>
            <li>Clicking outside the modal</li>
            <li>Clicking the "Close" button below</li>
          </ul>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Action"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to perform this action? This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                console.log("Action confirmed!");
                setShowConfirmModal(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

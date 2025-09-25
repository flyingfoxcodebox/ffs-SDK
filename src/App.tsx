import { useState } from "react";
import { LoginForm, type HandleLogin } from "../components/auth";
import InputField from "@ffx/components/ui/InputField";
import Button from "@ffx/components/ui/Button";
import Modal from "@ffx/components/ui/Modal";
import Spinner from "@ffx/components/ui/Spinner";
import FormGroup from "@ffx/components/ui/FormGroup";

const handleLogin: HandleLogin = async (email, password) => {
  await new Promise((r) => setTimeout(r, 700));
  console.log("Login attempted with:", email, password);
};

export default function App() {
  const [view] = useState<"login" | "signup" | "reset">("login");
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
      </div>

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

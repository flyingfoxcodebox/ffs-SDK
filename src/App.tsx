import { useState } from "react";
import { LoginForm, type HandleLogin } from "../components/auth";
import InputField from "@ffx/components/ui/InputField";

const handleLogin: HandleLogin = async (email, password) => {
  await new Promise((r) => setTimeout(r, 700));
  console.log("Login attempted with:", email, password);
};

export default function App() {
  const [view] = useState<"login" | "signup" | "reset">("login");
  const [testEmail, setTestEmail] = useState("");

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

      {/* 🧪 Test InputField here */}
      <div className="mt-8 w-full max-w-md">
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
    </main>
  );
}

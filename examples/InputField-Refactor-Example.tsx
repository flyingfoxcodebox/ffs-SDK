/**
 * InputField Refactor Example
 * ---------------------------
 * This example shows how to replace the existing Input subcomponent
 * in LoginForm with the new reusable InputField component.
 *
 * This demonstrates the migration path from form-specific inputs
 * to the atomic InputField component.
 */

import React, { useState } from "react";
import InputField from "@ffx/components/ui/InputField";

// ✅ BEFORE: LoginForm with internal Input component
// (This is what currently exists in LoginForm.tsx)

// ❌ OLD WAY - Internal Input component (lines 62-105 in LoginForm.tsx):
/*
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  }
>(function Input({ label, id, error, className, ...rest }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cx(
          "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400",
          "shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
          error && "border-red-400 ring-1 ring-red-400",
          className
        )}
        {...rest}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
});
*/

// ✅ AFTER: LoginForm using InputField component
// (This is how LoginForm could be refactored)

function LoginFormRefactored({
  handleLogin,
  forgotPasswordHref,
  title = "Welcome back",
  subtitle = "Please sign in to your account",
  submitLabel = "Sign in",
  initialEmail = "",
  className,
}: {
  handleLogin: (email: string, password: string) => Promise<void> | void;
  forgotPasswordHref?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  initialEmail?: string;
  className?: string;
}) {
  // Local state
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation and submit logic (same as original)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Use at least 8 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await Promise.resolve(handleLogin(email, password));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 ${
        className || ""
      }`}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Form-level error */}
      {errors.form && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {errors.form}
        </div>
      )}

      {/* Form with InputField components */}
      <form noValidate onSubmit={onSubmit} className="space-y-4">
        {/* ✅ REFACTORED: Using InputField instead of internal Input */}
        <InputField
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          inputMode="email"
          required
        />

        <InputField
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        {/* Rest of the form remains the same */}
        <div className="flex items-center justify-between">
          <div />
          {forgotPasswordHref && (
            <a
              href={forgotPasswordHref}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot password?
            </a>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60`}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Signing in…
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        By signing in you agree to our Terms and Privacy Policy.
      </div>
    </div>
  );
}

// ✅ COMPARISON: Before vs After

/*
BEFORE (Internal Input component):
- 44 lines of Input component code
- Duplicated across LoginForm, SignUpForm, PasswordResetForm
- Hard to maintain and update
- Inconsistent styling across forms

AFTER (InputField component):
- 2 lines to import InputField
- 8 lines per input field (vs 44 lines for component definition)
- Consistent styling across all forms
- Easy to maintain and update
- Additional features (helperText, success states, etc.)
- Better accessibility out of the box
*/

export default LoginFormRefactored;

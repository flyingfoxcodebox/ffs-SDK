# 🧱 LoginForm Component

A reusable, atomic login form with email/password fields, built-in validation, and flexible styling. Designed for maximum portability across projects — plug in any authentication provider (e.g., Supabase) without modifying the component itself.

---

## ✨ Overview

The `LoginForm` component handles all front-end concerns for user authentication:

- ✅ Email + password fields with accessible labels
- ✅ Client-side validation with helpful error messages
- ✅ Loading state with spinner
- ✅ Optional "Forgot password?" link
- ✅ Customizable title, subtitle, and button label
- ✅ Tailwind-only styling for seamless integration into any UI

---

## 📦 Props

| Name                 | Type                                                         | Required | Default                            | Description                                                                                      |
| -------------------- | ------------------------------------------------------------ | -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `handleLogin`        | `(email: string, password: string) => Promise<void> \| void` | ✅       | —                                  | Called when the form is submitted. You define what happens (e.g., call Supabase, Firebase, etc.) |
| `forgotPasswordHref` | `string`                                                     | ❌       | —                                  | URL for the "Forgot password?" link (hidden if omitted)                                          |
| `title`              | `string`                                                     | ❌       | `"Welcome back"`                   | Title text above the form                                                                        |
| `subtitle`           | `string`                                                     | ❌       | `"Please sign in to your account"` | Subtitle text below the title                                                                    |
| `submitLabel`        | `string`                                                     | ❌       | `"Sign in"`                        | Button text                                                                                      |
| `initialEmail`       | `string`                                                     | ❌       | `""`                               | Prefilled email value                                                                            |
| `className`          | `string`                                                     | ❌       | —                                  | Additional Tailwind classes for the outer container                                              |

---

## 🧪 Usage Example

```tsx
import LoginForm, { type HandleLogin } from "../components/auth/LoginForm";

const handleLogin: HandleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  console.log("Logged in as:", data.user?.email);
};

export function AuthPage() {
  return (
    <LoginForm
      handleLogin={handleLogin}
      forgotPasswordHref="/forgot"
      title="Sign in to your account"
      subtitle="Use your email and password to continue"
      submitLabel="Log In"
    />
  );
}
```

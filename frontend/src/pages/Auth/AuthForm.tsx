import { useId, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { authApi } from "@/services/api/auth";
import { ApiError } from "@/services/api/client";

type Mode = "login" | "signup";

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const copy = {
  login: {
    title: "Log in",
    subtitle: "Welcome back to Zoryn.",
    submit: "Log in",
    switchText: "New to Zoryn?",
    switchLink: "Create an account",
    switchTo: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "Save your work and pick up where you left off.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchTo: "/login",
  },
} as const;

// 16px (text-base) inputs stop iOS Safari zooming the page on focus; 48px
// minimum height keeps tap targets comfortable.
const inputClass =
  "block min-h-12 w-full rounded-lg border bg-white px-3.5 text-base text-[#1A1A1A] placeholder:text-[#9A9A9A] outline-none transition-colors focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/15";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const c = copy[mode];
  const uid = useId();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const id = (f: string) => `${uid}-${f}`;

  function validate(): Errors {
    const e: Errors = {};
    if (mode === "signup" && name.trim().length < 2) e.name = "Enter your name.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (mode === "login") {
      if (!password) e.password = "Enter your password.";
    } else {
      if (password.length < MIN_PASSWORD) e.password = `Use at least ${MIN_PASSWORD} characters.`;
      if (confirm !== password) e.confirm = "Passwords don't match.";
    }
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError(null);

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Move focus to the first invalid field.
      const first = (["name", "email", "password", "confirm"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await authApi.login({ email: email.trim(), password });
      } else {
        await authApi.signup({ name: name.trim(), email: email.trim(), password });
      }
      navigate("/explorer");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setFormError("Accounts aren't available yet. This service is still being set up.");
      } else if (err instanceof ApiError) {
        setFormError(err.message || "Something went wrong. Please try again.");
      } else {
        setFormError("Can't reach the Zoryn service. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const border = (k: keyof Errors) => (errors[k] ? "border-[#B42318]" : "border-[#D4D4D4]");
  const describe = (k: keyof Errors) => (errors[k] ? `${id(k)}-error` : undefined);

  return (
    <div className="sm:rounded-2xl sm:border sm:border-[#E5E5E5] sm:bg-white sm:p-8 sm:shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">{c.title}</h1>
      <p className="mt-2 text-sm text-[#6B6B6B]">{c.subtitle}</p>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
        {mode === "signup" && (
          <Field id={id("name")} label="Name" error={errors.name}>
            <input
              id={id("name")}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={describe("name")}
              className={`${inputClass} ${border("name")}`}
            />
          </Field>
        )}

        <Field id={id("email")} label="Email" error={errors.email}>
          <input
            id={id("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describe("email")}
            className={`${inputClass} ${border("email")}`}
          />
        </Field>

        <Field id={id("password")} label="Password" error={errors.password}>
          <div className="relative">
            <input
              id={id("password")}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={describe("password")}
              className={`${inputClass} ${border("password")} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.75} /> : <Eye className="h-5 w-5" strokeWidth={1.75} />}
            </button>
          </div>
          {mode === "signup" && !errors.password && (
            <p className="mt-1.5 text-xs text-[#6B6B6B]">At least {MIN_PASSWORD} characters.</p>
          )}
        </Field>

        {mode === "signup" && (
          <Field id={id("confirm")} label="Confirm password" error={errors.confirm}>
            <input
              id={id("confirm")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
              aria-describedby={describe("confirm")}
              className={`${inputClass} ${border("confirm")}`}
            />
          </Field>
        )}

        {formError && (
          <p role="alert" className="rounded-lg border border-[#F4C7C3] bg-[#FEF3F2] px-3.5 py-3 text-sm text-[#B42318]">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-4 text-base font-medium text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
          {submitting ? "Please wait…" : c.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B6B6B]">
        {c.switchText}{" "}
        <Link to={c.switchTo} className="font-medium text-[#1A1A1A] underline underline-offset-4">
          {c.switchLink}
        </Link>
      </p>
    </div>
  );
}

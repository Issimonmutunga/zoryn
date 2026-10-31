import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import AuthSubmit, { AuthError } from "@/components/auth/AuthSubmit";
import { useRegister } from "@/hooks/useAuth";
import { useCurrentUser } from "@/stores/authStore";

import { getRedirectTarget } from "./redirect";

// Mirrors ASP.NET Identity's default password policy, so most problems are
// caught before the request; the API remains the source of truth.
const PASSWORD_HINT =
  "At least 6 characters, with an uppercase letter, a lowercase letter, a number and a symbol.";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const register = useRegister();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const redirectTo = getRedirectTarget(location.state);

  if (currentUser && !register.isSuccess) {
    return <Navigate replace to={redirectTo} />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);

    register.mutate(
      {
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
      },
      { onSuccess: () => navigate(redirectTo, { replace: true }) },
    );
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create account"
      description="Create a Zoryn account to save regions and follow how environmental conditions evolve."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-medium text-[#1A1A1A] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={formError ?? register.error?.message ?? null} />

        <AuthField
          label="Name"
          name="displayName"
          autoComplete="name"
          placeholder="How should we address you?"
          optional
          maxLength={100}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          disabled={register.isPending}
        />

        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@organisation.org"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={register.isPending}
        />

        <AuthField
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          hint={PASSWORD_HINT}
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={register.isPending}
        />

        <AuthField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={register.isPending}
        />

        <AuthSubmit pending={register.isPending} pendingLabel="Creating account…">
          Create account
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

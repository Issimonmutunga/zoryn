import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import AuthSubmit, { AuthError } from "@/components/auth/AuthSubmit";
import { useLogin } from "@/hooks/useAuth";
import { useCurrentUser } from "@/stores/authStore";

import { fieldErrorsOf } from "./formErrors";
import { getRedirectTarget } from "./redirect";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectTo = getRedirectTarget(location.state);

  if (currentUser && !login.isSuccess) {
    return <Navigate replace to={redirectTo} />;
  }

  const fieldErrors = fieldErrorsOf(login.error);

  // Editing a field clears the previous attempt's errors.
  function edit(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);

      if (login.isError) {
        login.reset();
      }
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigate(redirectTo, { replace: true }) },
    );
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Sign in to your Zoryn account to continue exploring environmental discoveries."
      footer={
        <>
          New to Zoryn?{" "}
          <Link
            to="/signup"
            state={location.state}
            className="font-medium text-[#1A1A1A] underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError
          message={
            login.error && Object.keys(fieldErrors).length === 0
              ? login.error.message
              : null
          }
        />

        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@organisation.org"
          required
          value={email}
          error={fieldErrors.email}
          onChange={edit(setEmail)}
          disabled={login.isPending}
        />

        <AuthField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          error={fieldErrors.password}
          onChange={edit(setPassword)}
          disabled={login.isPending}
        />

        <AuthSubmit pending={login.isPending} pendingLabel="Signing in…">
          Sign in
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

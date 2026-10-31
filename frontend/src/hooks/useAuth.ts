import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/services/api/auth";
import { ApiError } from "@/services/api/client";
import {
  isSessionActive,
  useAuthStore,
} from "@/stores/authStore";

import type {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin() {

  const setSession =
    useAuthStore(
      (state) => state.setSession,
    );

  return useMutation({

    mutationFn: (body: LoginRequest) =>
      authApi.login(body),

    onSuccess: setSession,

  });

}

export function useRegister() {

  const setSession =
    useAuthStore(
      (state) => state.setSession,
    );

  return useMutation({

    mutationFn: (body: RegisterRequest) =>
      authApi.register(body),

    onSuccess: setSession,

  });

}

// Revalidates a stored session once on load: drops it if it has expired
// or the API no longer recognises it, and refreshes the cached profile.
export function useSessionCheck() {

  useEffect(() => {

    const {
      session,
      setUser,
      signOut,
    } = useAuthStore.getState();

    if (!session) {
      return;
    }

    if (!isSessionActive(session)) {
      signOut();
      return;
    }

    authApi
      .me(session.accessToken)
      .then(setUser)
      .catch((error: unknown) => {
        // Network failures keep the session; only a rejected token ends it.
        if (
          error instanceof ApiError &&
          error.status === 401
        ) {
          signOut();
        }
      });

  }, []);

}

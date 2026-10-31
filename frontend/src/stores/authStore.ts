import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  AuthSession,
  AuthUser,
} from "@/types/auth";

export interface AuthState {
  session: AuthSession | null;

  setSession: (
    session: AuthSession,
  ) => void;

  setUser: (
    user: AuthUser,
  ) => void;

  signOut: () => void;
}

export function isSessionActive(
  session: AuthSession | null,
): session is AuthSession {
  return (
    session !== null &&
    Date.parse(session.expiresAtUtc) >
      Date.now()
  );
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({

        session: null,

        setSession: (session) =>
          set({ session }),

        setUser: (user) =>
          set((state) =>
            state.session
              ? {
                  session: {
                    ...state.session,
                    user,
                  },
                }
              : state,
          ),

        signOut: () =>
          set({ session: null }),

      }),
      {
        name: "zoryn-auth",
        storage: createJSONStorage(
          () => localStorage,
        ),
      },
    ),
  );

// The signed-in user, or null once the token has expired.
export function useCurrentUser() {
  return useAuthStore((state) =>
    isSessionActive(state.session)
      ? state.session.user
      : null,
  );
}

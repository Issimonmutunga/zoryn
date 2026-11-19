import { apiClient } from "./client";

// Front-end half of authentication. The Zoryn API does not expose these
// endpoints yet; the screens call them and surface a clear message when the
// service is unavailable. Tokens are deliberately NOT persisted in
// localStorage here — session handling (e.g. an httpOnly cookie) is a backend
// decision that should be made together with the endpoints.

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  user?: { id: string; name?: string; email: string };
}

export const authApi = {
  login(body: LoginRequest) {
    return apiClient.post<AuthResponse, LoginRequest>("/auth/login", body);
  },
  signup(body: SignupRequest) {
    return apiClient.post<AuthResponse, SignupRequest>("/auth/signup", body);
  },
};

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  createdAtUtc: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAtUtc: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

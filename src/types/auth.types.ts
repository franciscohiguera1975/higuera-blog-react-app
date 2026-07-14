// src/types/auth.types.ts
export interface AuthTokenResponse {
  access_token: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}
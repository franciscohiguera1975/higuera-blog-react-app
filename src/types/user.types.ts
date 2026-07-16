// src/types/user.types.ts
export interface User {
  id: string
  username: string
  email: string
  isActive: boolean
  profile?: string
  avatarUrl?: string
  googleId?: any
}

export interface CreateUserPayload {
  username: string
  email: string
  password: string
}
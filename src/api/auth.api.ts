// src/api/auth.api.ts
import { http } from './http'
import type { ApiResponse } from '@/types/common.types'
import type { AuthTokenResponse, LoginPayload, RegisterPayload } from '@/types/auth.types'
import type { User } from '@/types/user.types'

export async function login(payload: LoginPayload) {
  const { data } = await http.post<ApiResponse<AuthTokenResponse>>('/auth/login', payload)
  return data.data.access_token
}

export async function register(payload: RegisterPayload) {
  const { data } = await http.post<ApiResponse<AuthTokenResponse>>('/auth/register', payload)
  return data.data.access_token
}

export async function unlinkGoogle() {
  const { data } = await http.delete<ApiResponse<User>>('/auth/google')
  return data.data
}
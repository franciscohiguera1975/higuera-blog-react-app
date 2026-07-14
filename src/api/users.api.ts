// src/api/users.api.ts
import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { User, CreateUserPayload } from '@/types/user.types'
import type { ListQuery } from '@/types/query.types'

export async function getUsers(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<User>>>('/users', { params: query })
  return data.data
}

export async function getUser(id: string) {
  const { data } = await http.get<ApiResponse<User>>(`/users/${id}`)
  return data.data
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await http.post<ApiResponse<User>>('/users', payload)
  return data.data
}

export async function updateUser(id: string, payload: { username?: string; email?: string; password?: string }) {
  const { data } = await http.put<ApiResponse<User>>(`/users/${id}`, payload)
  return data.data
}

export async function deleteUser(id: string) {
  await http.delete(`/users/${id}`)
}

export async function uploadProfileImage(id: string, file: File) {
  const formData = new FormData()
  formData.append('profile', file)
  const { data } = await http.put<ApiResponse<User>>(`/users/${id}/profile`, formData)
  return data.data
}
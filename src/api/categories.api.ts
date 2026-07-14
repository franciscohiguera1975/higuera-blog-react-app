// src/api/categories.api.ts
import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Category, CreateCategoryPayload } from '@/types/category.types'
import type { ListQuery } from '@/types/query.types'

export async function getCategories(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<Category>>>('/categories', { params: query })
  return data.data
}

export async function createCategory(payload: CreateCategoryPayload) {
  const { data } = await http.post<ApiResponse<Category>>('/categories', payload)
  return data.data
}

export async function updateCategory(id: string, payload: CreateCategoryPayload) {
  const { data } = await http.put<ApiResponse<Category>>(`/categories/${id}`, payload)
  return data.data
}

export async function deleteCategory(id: string) {
  await http.delete(`/categories/${id}`)
}
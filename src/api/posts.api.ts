// src/api/posts.api.ts
import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Post, CreatePostPayload } from '@/types/post.types'
import type { ListQuery } from '@/types/query.types'

export async function getPosts(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<Post>>>('/posts', { params: query })
  return data.data
}

export async function getPost(id: string) {
  const { data } = await http.get<ApiResponse<Post>>(`/posts/${id}`)
  return data.data
}

export async function createPost(payload: CreatePostPayload) {
  const { data } = await http.post<ApiResponse<Post>>('/posts', payload)
  return data.data
}

export async function updatePost(id: string, payload: CreatePostPayload) {
  const { data } = await http.put<ApiResponse<Post>>(`/posts/${id}`, payload)
  return data.data
}

export async function deletePost(id: string) {
  await http.delete(`/posts/${id}`)
}
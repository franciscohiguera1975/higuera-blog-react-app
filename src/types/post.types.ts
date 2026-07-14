import type { Category } from "./category.types"


export interface Post {
  id: string
  title: string
  content: string
  category: Category
}

export interface CreatePostPayload {
  title: string
  content: string
  categoryId: string
}
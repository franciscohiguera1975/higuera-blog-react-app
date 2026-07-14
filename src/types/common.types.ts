// src/types/common.types.ts
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}
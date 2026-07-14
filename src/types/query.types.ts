// src/types/query.types.ts
export interface ListQuery {
  page?: number
  limit?: number
  search?: string
  searchField?: string
  sort?: string
  order?: 'ASC' | 'DESC'
}
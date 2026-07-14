// src/api/http.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useAuthStore.getState().logout()
    const message = error.response?.data?.message ?? 'Ocurrió un error inesperado'
    useToastStore.getState().show(Array.isArray(message) ? message.join(', ') : message)
    return Promise.reject(error)
  },
)
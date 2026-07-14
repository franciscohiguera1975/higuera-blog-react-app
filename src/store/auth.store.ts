// src/store/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeToken } from '@/lib/jwt'

interface AuthState {
  token: string | null
  userId: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) =>
        set({ token, userId: decodeToken(token)?.id ?? null, isAuthenticated: true }),
      logout: () => set({ token: null, userId: null, isAuthenticated: false }),
    }),
    { name: 'blogapp-auth' },
  ),
)
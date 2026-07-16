import type { User } from "@/types/user.types"

// src/lib/urls.ts
export function profileImageUrl(filename?: string) {
  if (!filename) return undefined
  return `${import.meta.env.VITE_API_BASE_URL}/profile/${filename}`
}

export function googleAuthUrl(state?: string) {
  const base = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  return state ? `${base}?state=${encodeURIComponent(state)}` : base
}


export function avatarSrc(user?: Pick<User, 
  'avatarUrl' | 'profile'> | null) {
  if (!user) return undefined
  return user.avatarUrl ?? profileImageUrl(user.profile)
}
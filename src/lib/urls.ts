// src/lib/urls.ts
export function profileImageUrl(filename?: string) {
  if (!filename) return undefined
  return `${import.meta.env.VITE_API_BASE_URL}/profile/${filename}`
}
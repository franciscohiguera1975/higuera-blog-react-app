// src/lib/avatar-color.ts
const PALETTE = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-teal-500', 'bg-blue-500', 'bg-violet-500', 'bg-pink-500',
]

export function avatarColor(username: string) {
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}
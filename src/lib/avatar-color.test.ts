// src/lib/avatar-color.test.ts
import { avatarColor } from './avatar-color'

const PALETTE = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-teal-500', 'bg-blue-500', 'bg-violet-500', 'bg-pink-500',
]

describe('avatarColor()', () => {
  it('should return the same color for the same username', () => {
    expect(avatarColor('higuera')).toBe(avatarColor('higuera'))
  })

  it('should return a color from the palette', () => {
    expect(PALETTE).toContain(avatarColor('cualquier-usuario'))
  })

  it('should return different colors for usernames with different character sums', () => {
    expect(avatarColor('a')).not.toBe(avatarColor('b'))
  })
})
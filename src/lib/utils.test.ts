// src/lib/utils.test.ts
import { cn } from './utils'

describe('cn()', () => {
  it('should join plain class names', () => {
    expect(cn('p-4', 'text-sm')).toBe('p-4 text-sm')
  })

  it('should drop falsy values from conditional classes', () => {
    expect(cn('p-4', false && 'hidden', undefined, 'text-sm')).toBe('p-4 text-sm')
  })

  it('should let the last conflicting Tailwind class win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
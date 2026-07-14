// src/lib/urls.test.ts
import { profileImageUrl } from './urls'

describe('profileImageUrl()', () => {
  it('should return undefined when no filename is given', () => {
    expect(profileImageUrl(undefined)).toBeUndefined()
  })

  it('should build the full URL against VITE_API_BASE_URL when a filename is given', () => {
    const base = import.meta.env.VITE_API_BASE_URL
    expect(profileImageUrl('avatar-123.png')).toBe(`${base}/profile/avatar-123.png`)
  })
})
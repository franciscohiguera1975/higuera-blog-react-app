// src/lib/jwt.test.ts
import { decodeToken } from './jwt'

function fakeToken(payload: object) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('decodeToken()', () => {
  it('should return the decoded payload for a valid token', () => {
    const token = fakeToken({ id: 'user-123' })
    expect(decodeToken(token)).toEqual({ id: 'user-123' })
  })

  it('should return null when the token has no dot-separated payload', () => {
    expect(decodeToken('not-a-jwt')).toBeNull()
  })

  it('should return null when the payload is not valid base64/JSON', () => {
    expect(decodeToken('header.@@@not-base64@@@.signature')).toBeNull()
  })
})
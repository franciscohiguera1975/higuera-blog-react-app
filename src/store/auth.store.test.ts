// src/store/auth.store.test.ts
import { useAuthStore } from './auth.store'

const INITIAL_STATE = { token: null, userId: null, isAuthenticated: false }

beforeEach(() => {
  useAuthStore.setState(INITIAL_STATE)
  localStorage.clear()
})

// src/store/auth.store.test.ts (continuación)
function fakeToken(payload: object) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

// src/store/auth.store.test.ts (continuación)
describe('useAuthStore', () => {
  it('should start unauthenticated with no token', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.userId).toBeNull()
  })

  it('should store the token and decode the userId on setToken()', () => {
    const token = fakeToken({ id: 'user-42' })
    useAuthStore.getState().setToken(token)

    const state = useAuthStore.getState()
    expect(state.token).toBe(token)
    expect(state.userId).toBe('user-42')
    expect(state.isAuthenticated).toBe(true)
  })

  it('should set userId to null when the token cannot be decoded, but still authenticate', () => {
    useAuthStore.getState().setToken('not-a-jwt')

    const state = useAuthStore.getState()
    expect(state.userId).toBeNull()
    expect(state.isAuthenticated).toBe(true)
  })

  it('should clear token, userId and isAuthenticated on logout()', () => {
    useAuthStore.getState().setToken(fakeToken({ id: 'user-42' }))
    useAuthStore.getState().logout()

    expect(useAuthStore.getState()).toMatchObject(INITIAL_STATE)
  })
})


// src/store/auth.store.test.ts (continuación)
describe('persistencia', () => {
  it('should write the token under the "blogapp-auth" key in localStorage', () => {
    const token = fakeToken({ id: 'user-42' })
    useAuthStore.getState().setToken(token)

    const raw = localStorage.getItem('blogapp-auth')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!).state.token).toBe(token)
  })

  it('should not leave a persisted token after logout()', () => {
    useAuthStore.getState().setToken(fakeToken({ id: 'user-42' }))
    useAuthStore.getState().logout()

    const raw = localStorage.getItem('blogapp-auth')
    expect(JSON.parse(raw!).state.token).toBeNull()
  })
})
// src/api/http.test.ts
import { http as mswHttp, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useAuthStore } from '@/store/auth.store'
import { http } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

beforeEach(() => {
  useAuthStore.setState({ token: null, userId: null, isAuthenticated: false })
})

describe('http.ts — interceptor de request', () => {
  it('should attach the Authorization header when there is a token', async () => {
    useAuthStore.getState().setToken('fake-jwt-token')
    let receivedAuth: string | null = null
    server.use(
      mswHttp.get(`${BASE_URL}/ping`, ({ request }) => {
        receivedAuth = request.headers.get('Authorization')
        return HttpResponse.json({ success: true, message: 'pong', data: null })
      }),
    )

    await http.get('/ping')
    expect(receivedAuth).toBe('Bearer fake-jwt-token')
  })

  it('should not attach an Authorization header when there is no token', async () => {
    let receivedAuth: string | null = null
    server.use(
      mswHttp.get(`${BASE_URL}/ping`, ({ request }) => {
        receivedAuth = request.headers.get('Authorization')
        return HttpResponse.json({ success: true, message: 'pong', data: null })
      }),
    )

    await http.get('/ping')
    expect(receivedAuth).toBeNull()
  })
})

describe('http.ts — interceptor de response', () => {
  it('should log the user out when the API responds with 401', async () => {
    useAuthStore.getState().setToken('fake-jwt-token')
    server.use(mswHttp.get(`${BASE_URL}/ping`, () => new HttpResponse(null, { status: 401 })))

    await expect(http.get('/ping')).rejects.toMatchObject({ response: { status: 401 } })
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('should not log the user out on other error statuses', async () => {
    useAuthStore.getState().setToken('fake-jwt-token')
    server.use(mswHttp.get(`${BASE_URL}/ping`, () => new HttpResponse(null, { status: 500 })))

    await expect(http.get('/ping')).rejects.toMatchObject({ response: { status: 500 } })
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
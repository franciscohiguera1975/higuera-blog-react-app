// src/pages/public/LoginPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuthStore } from '@/store/auth.store'
import LoginPage from './LoginPage'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/api/auth.api', () => ({
  login: vi.fn(),
}))

import { login } from '@/api/auth.api'

beforeEach(() => {
  vi.clearAllMocks()
  useAuthStore.setState({ token: null, userId: null, isAuthenticated: false })
})

describe('LoginPage — validación', () => {
  it('should show a required error for both fields on empty submit', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(await screen.findAllByText('Requerido')).toHaveLength(2)
    expect(login).not.toHaveBeenCalled()
  })
})


// src/pages/public/LoginPage.test.tsx (continuación)
describe('LoginPage — submit exitoso', () => {
  it('should call login, store the token and navigate to "/" on valid credentials', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockResolvedValue('fake-jwt-token')

    render(<LoginPage />)
    await user.type(screen.getByLabelText('Usuario'), 'higuera')
    await user.type(screen.getByLabelText('Contraseña'), 'secret')
    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ username: 'higuera', password: 'secret' })
    })
    expect(useAuthStore.getState().token).toBe('fake-jwt-token')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('should disable the submit button and show "Ingresando..." while submitting', async () => {
    const user = userEvent.setup()
    let resolveLogin!: (token: string) => void
    vi.mocked(login).mockReturnValue(new Promise((resolve) => { resolveLogin = resolve }))

    render(<LoginPage />)
    await user.type(screen.getByLabelText('Usuario'), 'higuera')
    await user.type(screen.getByLabelText('Contraseña'), 'secret')
    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(screen.getByRole('button', { name: /ingresando/i })).toBeDisabled()
    resolveLogin('fake-jwt-token')
  })
})
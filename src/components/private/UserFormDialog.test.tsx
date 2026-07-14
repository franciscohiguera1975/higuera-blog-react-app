// src/components/private/UserFormDialog.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserFormDialog from './UserFormDialog'

vi.mock('@/api/users.api', () => ({
  createUser: vi.fn(),
  updateUser: vi.fn(),
}))

import { createUser, updateUser } from '@/api/users.api'

const onOpenChange = vi.fn()
const onSaved = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('UserFormDialog — creación', () => {
  it('should require a password of at least 6 characters', async () => {
    const user = userEvent.setup()
    render(<UserFormDialog open onOpenChange={onOpenChange} user={null} onSaved={onSaved} />)

    await user.type(screen.getByLabelText('Usuario'), 'higuera')
    await user.type(screen.getByLabelText('Email'), 'higuera@blogapp.dev')
    await user.type(screen.getByLabelText('Contraseña'), '123')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    expect(await screen.findByText('Mínimo 6 caracteres')).toBeInTheDocument()
    expect(createUser).not.toHaveBeenCalled()
  })

  it('should call createUser with the typed fields', async () => {
    const user = userEvent.setup()
    vi.mocked(createUser).mockResolvedValue({} as never)

    render(<UserFormDialog open onOpenChange={onOpenChange} user={null} onSaved={onSaved} />)
    await user.type(screen.getByLabelText('Usuario'), 'higuera')
    await user.type(screen.getByLabelText('Email'), 'higuera@blogapp.dev')
    await user.type(screen.getByLabelText('Contraseña'), 'secret123')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(createUser).toHaveBeenCalledWith({
        username: 'higuera',
        email: 'higuera@blogapp.dev',
        password: 'secret123',
      }),
    )
  })
})

describe('UserFormDialog — edición', () => {
  const user_ = { id: 'user-1', username: 'higuera', email: 'higuera@blogapp.dev', isActive: true }

  it('should allow saving without typing a new password', async () => {
    const user = userEvent.setup()
    vi.mocked(updateUser).mockResolvedValue({} as never)

    render(<UserFormDialog open onOpenChange={onOpenChange} user={user_} onSaved={onSaved} />)
    expect(screen.getByLabelText('Usuario')).toHaveValue('higuera')

    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith('user-1', {
        username: 'higuera',
        email: 'higuera@blogapp.dev',
      }),
    )
    expect(createUser).not.toHaveBeenCalled()
  })

  it('should include the new password when one is typed', async () => {
    const user = userEvent.setup()
    vi.mocked(updateUser).mockResolvedValue({} as never)

    render(<UserFormDialog open onOpenChange={onOpenChange} user={user_} onSaved={onSaved} />)
    await user.type(screen.getByLabelText('Contraseña'), 'nuevaClave123')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith('user-1', {
        username: 'higuera',
        email: 'higuera@blogapp.dev',
        password: 'nuevaClave123',
      }),
    )
  })
})
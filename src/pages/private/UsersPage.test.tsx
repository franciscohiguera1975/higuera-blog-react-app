// src/pages/private/UsersPage.test.tsx
import { http, HttpResponse } from 'msw'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import UsersPage from './UsersPage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

it('should list, create, edit and delete a user end to end', async () => {
  let users = [{ id: 'user-1', username: 'higuera', email: 'higuera@blogapp.dev', isActive: true }]

  server.use(
    http.get(`${BASE_URL}/users`, () =>
      HttpResponse.json({
        success: true,
        message: 'OK',
        data: { items: users, meta: { itemCount: users.length, totalItems: users.length, itemsPerPage: 50, totalPages: 1, currentPage: 1 } },
      }),
    ),
    http.post(`${BASE_URL}/users`, async ({ request }) => {
      const body = (await request.json()) as { username: string; email: string }
      const created = { id: 'user-2', username: body.username, email: body.email, isActive: true }
      users = [...users, created]
      return HttpResponse.json({ success: true, message: 'OK', data: created }, { status: 201 })
    }),
    http.put(`${BASE_URL}/users/:id`, async ({ params, request }) => {
      const body = (await request.json()) as { username: string; email: string }
      users = users.map((u) => (u.id === params.id ? { ...u, ...body } : u))
      return HttpResponse.json({ success: true, message: 'OK', data: { id: params.id, ...body } })
    }),
    http.delete(`${BASE_URL}/users/:id`, ({ params }) => {
      users = users.filter((u) => u.id !== params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )

  const user = userEvent.setup()
  render(<UsersPage />)

  // 1. Listado inicial
  expect(await screen.findByText('higuera')).toBeInTheDocument()

  // 2. Crear
  await user.click(screen.getByRole('button', { name: /nuevo usuario/i }))
  await user.type(screen.getByLabelText('Usuario'), 'nuevo-user')
  await user.type(screen.getByLabelText('Email'), 'nuevo@blogapp.dev')
  await user.type(screen.getByLabelText('Contraseña'), 'secret123')
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('nuevo-user')).toBeInTheDocument()

  // 3. Editar
  const row = screen.getByText('nuevo-user').closest('tr')!
  await user.click(within(row).getByRole('button', { name: /editar/i }))
  const usernameInput = screen.getByLabelText('Usuario')
  await user.clear(usernameInput)
  await user.type(usernameInput, 'usuario-editado')
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('usuario-editado')).toBeInTheDocument()

  // 4. Borrar
  const editedRow = screen.getByText('usuario-editado').closest('tr')!
  await user.click(within(editedRow).getByRole('button', { name: /borrar/i }))
  await waitFor(() => expect(screen.queryByText('usuario-editado')).not.toBeInTheDocument())
})
// src/pages/private/PostsPage.test.tsx
import { http, HttpResponse } from 'msw'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import { renderWithRouter } from '@/test/render'
import PostsPage from './PostsPage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const CATEGORY = { id: '11111111-1111-4111-8111-111111111111', name: 'Tech' }

it('should list, create, edit and delete a post end to end', async () => {
  let posts = [{ id: 'post-1', title: 'Primer post', content: 'Contenido', category: CATEGORY }]

  server.use(
    http.get(`${BASE_URL}/categories`, () =>
      HttpResponse.json({
        success: true,
        message: 'OK',
        data: { items: [CATEGORY], meta: { itemCount: 1, totalItems: 1, itemsPerPage: 100, totalPages: 1, currentPage: 1 } },
      }),
    ),
    http.get(`${BASE_URL}/posts`, () =>
      HttpResponse.json({
        success: true,
        message: 'OK',
        data: { items: posts, meta: { itemCount: posts.length, totalItems: posts.length, itemsPerPage: 50, totalPages: 1, currentPage: 1 } },
      }),
    ),
    http.post(`${BASE_URL}/posts`, async ({ request }) => {
      const body = (await request.json()) as { title: string; content: string; categoryId: string }
      const created = { id: 'post-2', title: body.title, content: body.content, category: CATEGORY }
      posts = [...posts, created]
      return HttpResponse.json({ success: true, message: 'OK', data: created }, { status: 201 })
    }),
    http.put(`${BASE_URL}/posts/:id`, async ({ params, request }) => {
      const body = (await request.json()) as { title: string; content: string; categoryId: string }
      posts = posts.map((p) => (p.id === params.id ? { ...p, title: body.title, content: body.content } : p))
      return HttpResponse.json({ success: true, message: 'OK', data: { id: params.id, ...body, category: CATEGORY } })
    }),
    http.delete(`${BASE_URL}/posts/:id`, ({ params }) => {
      posts = posts.filter((p) => p.id !== params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )

  const user = userEvent.setup()
  // PostsPage renderiza un <Link> por cada fila (al detalle del post), por eso necesita un Router.
  renderWithRouter(<PostsPage />)

  // 1. Listado inicial
  expect(await screen.findByText('Primer post')).toBeInTheDocument()

  // 2. Crear
  await user.click(screen.getByRole('button', { name: /nuevo post/i }))
  await user.type(screen.getByLabelText('Título'), 'Post nuevo')
  await user.type(screen.getByLabelText('Contenido'), 'Contenido del post nuevo')
  await user.click(screen.getByRole('combobox'))
  await user.click(await screen.findByRole('option', { name: 'Tech' }))
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('Post nuevo')).toBeInTheDocument()

  // 3. Editar
  const row = screen.getByText('Post nuevo').closest('tr')!
  await user.click(within(row).getByRole('button', { name: /editar/i }))
  const titleInput = await screen.findByLabelText('Título')
  await user.clear(titleInput)
  await user.type(titleInput, 'Post editado')
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('Post editado')).toBeInTheDocument()

  // 4. Borrar
  const editedRow = screen.getByText('Post editado').closest('tr')!
  await user.click(within(editedRow).getByRole('button', { name: /borrar/i }))
  await waitFor(() => expect(screen.queryByText('Post editado')).not.toBeInTheDocument())
})
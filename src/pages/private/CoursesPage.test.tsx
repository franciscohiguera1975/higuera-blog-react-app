// src/pages/private/CoursesPage.test.tsx
import { http, HttpResponse } from 'msw'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import CoursesPage from './CoursesPage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function baseCurso(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    _id: 'curso-1',
    nombre: 'React desde cero',
    descripcion: 'Curso introductorio de React',
    categoria: 'Frontend',
    fecha_inicio: '2026-08-01',
    fecha_fin: '2026-09-01',
    nivel: 'Básico',
    requisitos: [],
    precio: 49.9,
    instructor: { nombre: 'Ana Higuera', email: 'ana@blogapp.dev' },
    calificacion_promedio: 4.5,
    estado: 'activo',
    contenidos: [],
    ...overrides,
  }
}

it('should list, create, edit and delete a course end to end', async () => {
  let courses = [baseCurso()]

  server.use(
    http.get(`${BASE_URL}/cursos`, () =>
      HttpResponse.json({ success: true, message: 'OK', data: { items: courses, page: 1, limit: 50 } }),
    ),
    http.post(`${BASE_URL}/cursos`, async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      const created = baseCurso({ ...body, _id: 'curso-2' })
      courses = [...courses, created]
      return HttpResponse.json({ success: true, message: 'OK', data: created }, { status: 201 })
    }),
    http.put(`${BASE_URL}/cursos/:id`, async ({ params, request }) => {
      const body = (await request.json()) as Record<string, unknown>
      courses = courses.map((c) => (c._id === params.id ? { ...c, ...body } : c))
      return HttpResponse.json({ success: true, message: 'OK', data: { ...body, _id: params.id } })
    }),
    http.delete(`${BASE_URL}/cursos/:id`, ({ params }) => {
      courses = courses.filter((c) => c._id !== params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )

  const user = userEvent.setup()
  render(<CoursesPage />)

  // 1. Listado inicial
  expect(await screen.findByText('React desde cero')).toBeInTheDocument()

  // 2. Crear (reutiliza los mismos labels que el Módulo 8.5)
  await user.click(screen.getByRole('button', { name: /nuevo curso/i }))
  await user.type(screen.getByLabelText('Nombre'), 'Testing con Vitest')
  await user.type(screen.getByLabelText('Descripción'), 'Curso de testing frontend')
  await user.type(screen.getByLabelText('Categoría'), 'Testing')
  await user.type(screen.getByLabelText('Nivel'), 'Intermedio')
  await user.type(screen.getByLabelText('Fecha de inicio'), '2026-10-01')
  await user.type(screen.getByLabelText('Fecha de fin'), '2026-11-01')
  await user.type(screen.getByLabelText('Precio'), '39')
  await user.type(screen.getByLabelText('Calificación promedio'), '5')
  await user.type(screen.getByLabelText('Estado'), 'activo')
  await user.type(screen.getByLabelText('Instructor'), 'Higuera')
  await user.type(screen.getByLabelText('Email del instructor'), 'higuera@blogapp.dev')
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('Testing con Vitest')).toBeInTheDocument()

  // 3. Editar
  const row = screen.getByText('Testing con Vitest').closest('tr')!
  await user.click(within(row).getByRole('button', { name: /editar/i }))
  const nombreInput = screen.getByLabelText('Nombre')
  await user.clear(nombreInput)
  await user.type(nombreInput, 'Testing con Vitest (editado)')
  await user.click(screen.getByRole('button', { name: /guardar/i }))
  expect(await screen.findByText('Testing con Vitest (editado)')).toBeInTheDocument()

  // 4. Borrar
  const editedRow = screen.getByText('Testing con Vitest (editado)').closest('tr')!
  await user.click(within(editedRow).getByRole('button', { name: /borrar/i }))
  await waitFor(() => expect(screen.queryByText('Testing con Vitest (editado)')).not.toBeInTheDocument())
})
// src/components/private/PostFormDialog.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostFormDialog from './PostFormDialog'

vi.mock('@/api/posts.api', () => ({
  createPost: vi.fn(),
  updatePost: vi.fn(),
}))

vi.mock('@/api/categories.api', () => ({
  getCategories: vi.fn(),
}))

import { createPost, updatePost } from '@/api/posts.api'
import { getCategories } from '@/api/categories.api'

// UUID válido: la tercera sección debe empezar en 1-5 (versión) y la cuarta en 8-b (variante),
// o `z.string().uuid()` la rechaza igual que rechazaría cualquier UUID mal formado.
const CATEGORY_ID = '11111111-1111-4111-8111-111111111111'
const onOpenChange = vi.fn()
const onSaved = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getCategories).mockResolvedValue({
    items: [{ id: CATEGORY_ID, name: 'Tech' }],
    meta: { itemCount: 1, totalItems: 1, itemsPerPage: 100, totalPages: 1, currentPage: 1 },
  })
})

describe('PostFormDialog — creación', () => {
  it('should call createPost with the typed fields and the selected category', async () => {
    const user = userEvent.setup()
    vi.mocked(createPost).mockResolvedValue({
      id: 'post-1',
      title: 'Nuevo post',
      content: 'Contenido de prueba',
      category: { id: CATEGORY_ID, name: 'Tech' },
    })

    render(<PostFormDialog open onOpenChange={onOpenChange} post={null} onSaved={onSaved} />)

    await user.type(screen.getByLabelText('Título'), 'Nuevo post')
    await user.type(screen.getByLabelText('Contenido'), 'Contenido de prueba')
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Tech' }))
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(createPost).toHaveBeenCalledWith({
        title: 'Nuevo post',
        content: 'Contenido de prueba',
        categoryId: CATEGORY_ID,
      }),
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSaved).toHaveBeenCalled()
  })

  it('should show a validation error when no category is selected', async () => {
    const user = userEvent.setup()
    render(<PostFormDialog open onOpenChange={onOpenChange} post={null} onSaved={onSaved} />)

    await user.type(screen.getByLabelText('Título'), 'Nuevo post')
    await user.type(screen.getByLabelText('Contenido'), 'Contenido de prueba')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    // El mismo texto también aparece como placeholder dentro del <SelectValue>, por eso acotamos
    // la búsqueda al <p> del mensaje de error para evitar un "Found multiple elements".
    expect(await screen.findByText('Selecciona una categoría', { selector: 'p' })).toBeInTheDocument()
    expect(createPost).not.toHaveBeenCalled()
  })
})

describe('PostFormDialog — edición', () => {
  const post = {
    id: 'post-1',
    title: 'Post existente',
    content: 'Contenido viejo',
    category: { id: CATEGORY_ID, name: 'Tech' },
  }

  it('should prefill title and content when editing', async () => {
    render(<PostFormDialog open onOpenChange={onOpenChange} post={post} onSaved={onSaved} />)

    expect(screen.getByLabelText('Título')).toHaveValue('Post existente')
    expect(screen.getByLabelText('Contenido')).toHaveValue('Contenido viejo')
    expect(await screen.findByRole('heading', { name: 'Editar post' })).toBeInTheDocument()
  })

  it('should call updatePost with the post id, keeping the existing category', async () => {
    const user = userEvent.setup()
    vi.mocked(updatePost).mockResolvedValue({ ...post, title: 'Post editado' })

    render(<PostFormDialog open onOpenChange={onOpenChange} post={post} onSaved={onSaved} />)

    const titleInput = await screen.findByLabelText('Título')
    await user.clear(titleInput)
    await user.type(titleInput, 'Post editado')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() =>
      expect(updatePost).toHaveBeenCalledWith('post-1', {
        title: 'Post editado',
        content: 'Contenido viejo',
        categoryId: CATEGORY_ID,
      }),
    )
    expect(createPost).not.toHaveBeenCalled()
  })
})
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFormDialog from './CategoryFormDialog'

vi.mock('@/api/categories.api', () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
}))

import { createCategory, updateCategory } from '@/api/categories.api'

const onOpenChange = vi.fn()
const onSaved = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CategoryFormDialog — creación', () => {
  it('should call createCategory with the typed name and close the dialog', async () => {
    const user = userEvent.setup()
    vi.mocked(createCategory).mockResolvedValue({ id: 'cat-1', name: 'Frontend' })

    render(<CategoryFormDialog open onOpenChange={onOpenChange} category={null} onSaved={onSaved} />)

    await user.type(screen.getByLabelText('Nombre'), 'Frontend')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() => expect(createCategory).toHaveBeenCalledWith({ name: 'Frontend' }))
    expect(updateCategory).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSaved).toHaveBeenCalled()
  })
})

describe('CategoryFormDialog — edición', () => {
  const category = { id: 'cat-1', name: 'Tech' }

  it('should prefill the name input with the category being edited', () => {
    render(<CategoryFormDialog open onOpenChange={onOpenChange} category={category} onSaved={onSaved} />)

    expect(screen.getByLabelText('Nombre')).toHaveValue('Tech')
    expect(screen.getByRole('heading', { name: 'Editar categoría' })).toBeInTheDocument()
  })

  it('should call updateCategory with the category id and the new name', async () => {
    const user = userEvent.setup()
    vi.mocked(updateCategory).mockResolvedValue({ ...category, name: 'Tecnología' })

    render(<CategoryFormDialog open onOpenChange={onOpenChange} category={category} onSaved={onSaved} />)

    const input = screen.getByLabelText('Nombre')
    await user.clear(input)
    await user.type(input, 'Tecnología')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() => expect(updateCategory).toHaveBeenCalledWith('cat-1', { name: 'Tecnología' }))
    expect(createCategory).not.toHaveBeenCalled()
  })
})
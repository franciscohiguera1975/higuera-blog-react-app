// src/router/ProtectedRoute.test.tsx
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { useAuthStore } from '@/store/auth.store'
import ProtectedRoute from './ProtectedRoute'

beforeEach(() => {
  useAuthStore.setState({ token: null, userId: null, isAuthenticated: false })
})

function renderProtected(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<p>Contenido privado</p>} />
        </Route>
        <Route path="/login" element={<p>Página de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('should redirect to /login when there is no session', () => {
    renderProtected('/dashboard')
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })

  it('should render the private outlet when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true })
    renderProtected('/dashboard')
    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
  })
})
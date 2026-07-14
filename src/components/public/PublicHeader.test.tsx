// src/components/public/PublicHeader.test.tsx
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/render'
import { useAuthStore } from '@/store/auth.store'
import PublicHeader from './PublicHeader'

beforeEach(() => {
  useAuthStore.setState({ token: null, userId: null, isAuthenticated: false })
})

describe('PublicHeader', () => {
  it('should show login and register links when there is no session', () => {
    renderWithRouter(<PublicHeader />)

    expect(screen.getByText('Ingresar')).toBeInTheDocument()
    expect(screen.getByText('Registrarme')).toBeInTheDocument()
    expect(screen.queryByText('Ir al dashboard')).not.toBeInTheDocument()
  })

  it('should show the dashboard link when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true })
    renderWithRouter(<PublicHeader />)

    expect(screen.getByText('Ir al dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Ingresar')).not.toBeInTheDocument()
  })
})
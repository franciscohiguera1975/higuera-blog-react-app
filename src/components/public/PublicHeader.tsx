// src/components/public/PublicHeader.tsx
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function PublicHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link to="/" className="font-semibold">BlogApp - Autor: Francisco Higuera</Link>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link to="/dashboard">Ir al dashboard</Link>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarme</Link>
          </>
        )}
      </div>
    </header>
  )
}
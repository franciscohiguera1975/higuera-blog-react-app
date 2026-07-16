// src/pages/public/GoogleCallbackPage.tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setToken = useAuthStore((s) => s.setToken)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login')
      return
    }
    setToken(token)
    navigate('/dashboard')
  }, [searchParams, setToken, navigate])

  return <div className="p-8 text-center text-muted-foreground">Iniciando sesión con Google...</div>
}
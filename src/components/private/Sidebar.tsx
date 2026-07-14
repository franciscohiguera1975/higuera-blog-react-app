// src/components/private/Sidebar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'

const menuItems = [
  { label: 'Categorías', to: '/categorias' },
  { label: 'Posts', to: '/posts' },
  { label: 'Cursos', to: '/cursos' },
  { label: 'Usuarios', to: '/usuarios' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="flex w-56 flex-col justify-between border-r p-4">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
            {item.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" onClick={handleLogout}>Salir</Button>
    </aside>
  )
}
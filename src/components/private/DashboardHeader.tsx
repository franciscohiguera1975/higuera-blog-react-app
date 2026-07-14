// src/components/private/DashboardHeader.tsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getUser } from '@/api/users.api'
import { avatarColor } from '@/lib/avatar-color'
import { cn } from '@/lib/utils'
import type { User } from '@/types/user.types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AvatarImage } from '@/components/ui/avatar'
import { profileImageUrl } from '@/lib/urls'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const logout = useAuthStore((s) => s.logout)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { if (userId) getUser(userId).then(setUser) }, [userId])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className="flex items-center justify-between border-b p-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImageUrl(user?.profile)} />
            <AvatarFallback className={cn(avatarColor(user?.username ?? '?'), 'text-white')}>
              {user?.username.slice(0, 2).toUpperCase() ?? '..'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.username ?? 'Cargando...'}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link to="/perfil">Mi perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Salir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
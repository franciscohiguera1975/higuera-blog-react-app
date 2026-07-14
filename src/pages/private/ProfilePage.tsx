// src/pages/private/ProfilePage.tsx
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth.store'
import { getUser, updateUser, uploadProfileImage } from '@/api/users.api'
import { profileImageUrl } from '@/lib/urls'
import { avatarColor } from '@/lib/avatar-color'
import { cn } from '@/lib/utils'
import type { User } from '@/types/user.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
})
type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  const [user, setUser] = useState<User | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (userId) getUser(userId).then((u) => { setUser(u); reset({ username: u.username, email: u.email }) })
  }, [userId, reset])

  const onSubmit = async (values: FormValues) => {
    if (!userId) return
    const updated = await updateUser(userId, values)
    setUser(updated)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    const updated = await uploadProfileImage(userId, file)
    setUser(updated)
  }

  if (!user) return <div className="p-8 text-muted-foreground">Cargando...</div>

  return (
    <div className="mx-auto max-w-sm space-y-6 p-8">
      <h1 className="text-xl font-semibold">Mi perfil</h1>
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImageUrl(user.profile)} />
          <AvatarFallback className={cn(avatarColor(user.username), 'text-2xl text-white')}>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" hidden onChange={handleAvatarChange} />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          Cambiar foto
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" {...register('username')} />
          {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  )
}
// src/pages/private/DashboardHomePage.tsx
import { useEffect, useState } from 'react'
import { FolderKanban, FileText, GraduationCap, Users, type LucideIcon } from 'lucide-react'
import { getCategories } from '@/api/categories.api'
import { getPosts } from '@/api/posts.api'
import { getCourses } from '@/api/courses.api'
import { getUsers } from '@/api/users.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CardConfig {
  label: string
  value: number
  icon: LucideIcon
  borderClass: string
  iconClass: string
}

export default function DashboardHomePage() {
  const [counts, setCounts] = useState({ categorias: 0, posts: 0, cursos: 0, usuarios: 0 })

  useEffect(() => {
    Promise.all([
      getCategories({ limit: 1 }),
      getPosts({ limit: 1 }),
      getCourses(1, 100),
      getUsers({ limit: 1 }),
    ]).then(([categorias, posts, cursos, usuarios]) => {
      setCounts({
        categorias: categorias.meta.totalItems,
        posts: posts.meta.totalItems,
        cursos: cursos.items.length, // aproximado: /cursos no expone un total real (ver Módulo 5)
        usuarios: usuarios.meta.totalItems,
      })
    })
  }, [])

  const cards: CardConfig[] = [
    { label: 'Categorías', value: counts.categorias, icon: FolderKanban, borderClass: 'border-l-blue-500', iconClass: 'bg-blue-50 text-blue-600' },
    { label: 'Posts', value: counts.posts, icon: FileText, borderClass: 'border-l-violet-500', iconClass: 'bg-violet-50 text-violet-600' },
    { label: 'Cursos', value: counts.cursos, icon: GraduationCap, borderClass: 'border-l-emerald-500', iconClass: 'bg-emerald-50 text-emerald-600' },
    { label: 'Usuarios', value: counts.usuarios, icon: Users, borderClass: 'border-l-orange-500', iconClass: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Resumen</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, borderClass, iconClass }) => (
          <Card key={label} className={`border-l-4 ${borderClass}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
              <div className={`rounded-full p-2 ${iconClass}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
// src/pages/public/HomePage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '@/api/posts.api'
import { getCourses } from '@/api/courses.api'
import type { Post } from '@/types/post.types'
import type { Curso } from '@/types/course.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PAGE_SIZE = 6

function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPosts({ page, limit: PAGE_SIZE, search: search || undefined, searchField: 'title' }).then((res) => {
      setPosts(res.items)
      setTotalPages(res.meta.totalPages)
    })
  }, [page, search])

  return (
    <div className="space-y-6">
      <Input
        placeholder="Buscar por título..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
      />
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link key={post.id} to={`/posts/${post.id}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {post.title}
                  <Badge variant="secondary">{post.category?.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="line-clamp-2 text-muted-foreground">
                {post.content}
              </CardContent>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No hay posts todavía.</p>}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
        <span className="text-sm">Página {page} de {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
      </div>
    </div>
  )
}

const COURSES_PAGE_SIZE = 6

function CoursesTab() {
  const [courses, setCourses] = useState<Curso[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    getCourses(page, COURSES_PAGE_SIZE).then((res) => setCourses(res.items))
  }, [page])

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {courses.map((curso) => (
          <Link key={curso._id} to={`/cursos/${curso._id}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {curso.nombre}
                  <Badge variant="secondary">{curso.categoria}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-muted-foreground">
                <span className="line-clamp-1">{curso.descripcion}</span>
                <span className="shrink-0 font-medium text-foreground">${curso.precio}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
        {courses.length === 0 && <p className="text-muted-foreground">No hay cursos todavía.</p>}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
        <span className="text-sm">Página {page}</span>
        <Button variant="outline" disabled={courses.length < COURSES_PAGE_SIZE} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="cursos">Cursos</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="pt-4">
          <PostsTab />
        </TabsContent>
        <TabsContent value="cursos" className="pt-4">
          <CoursesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
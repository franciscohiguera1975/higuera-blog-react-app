// src/pages/private/PostsPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts, deletePost } from '@/api/posts.api'
import type { Post } from '@/types/post.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PostFormDialog from '@/components/private/PostFormDialog'
import { useToastStore } from '@/store/toast.store'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Post | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getPosts({ limit: 50 })
    setPosts(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (post: Post) => {
    await deletePost(post.id)
    showToast('Post eliminado', 'success')
    await load()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Posts</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>Nuevo post</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Título</TableHead><TableHead>Categoría</TableHead><TableHead /></TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <Link to={`/posts/${post.id}`} className="hover:underline">{post.title}</Link>
              </TableCell>
              <TableCell><Badge variant="secondary">{post.category?.name}</Badge></TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(post); setDialogOpen(true) }}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { void handleDelete(post) }}>
                  Borrar
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No hay posts todavía.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <PostFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        post={editing}
        onSaved={load}
      />
    </div>
  )
}
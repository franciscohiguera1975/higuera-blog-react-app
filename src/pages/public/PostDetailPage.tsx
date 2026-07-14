// src/pages/public/PostDetailPage.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '@/api/posts.api'
import type { Post } from '@/types/post.types'
import { Badge } from '@/components/ui/badge'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => { if (id) getPost(id).then(setPost) }, [id])

  if (!post) return <div className="p-8 text-muted-foreground">Cargando...</div>

  return (
    <article className="mx-auto max-w-2xl space-y-4 p-8">
      <Link to="/" className="text-sm text-muted-foreground">← Volver</Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <Badge variant="secondary">{post.category?.name}</Badge>
      </div>
      <p className="whitespace-pre-line">{post.content}</p>
    </article>
  )
}
// src/components/private/PostFormDialog.tsx
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPost, updatePost } from '@/api/posts.api'
import { getCategories } from '@/api/categories.api'
import type { Post } from '@/types/post.types'
import type { Category } from '@/types/category.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToastStore } from '@/store/toast.store'

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  content: z.string().min(10, 'Mínimo 10 caracteres'),
  categoryId: z.string().uuid('Selecciona una categoría'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onSaved: () => void
}

export default function PostFormDialog({ open, onOpenChange, post, onSaved }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })
  const showToast = useToastStore((s) => s.show)

  useEffect(() => { getCategories({ limit: 100 }).then((res) => setCategories(res.items)) }, [])

  useEffect(() => {
    reset({
      title: post?.title ?? '',
      content: post?.content ?? '',
      categoryId: post?.category.id ?? '',
    })
  }, [post, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (post) await updatePost(post.id, values)
    else await createPost(values)
    showToast(post ? 'Post actualizado' : 'Post creado', 'success')
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{post ? 'Editar post' : 'Nuevo post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="content">Contenido</Label>
            <Textarea id="content" rows={6} {...register('content')} />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>
          <div>
            <Label>Categoría</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
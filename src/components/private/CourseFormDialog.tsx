// src/components/private/CourseFormDialog.tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCourse, updateCourse } from '@/api/courses.api'
import type { Curso } from '@/types/course.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToastStore } from '@/store/toast.store'

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres'),
  categoria: z.string().min(2, 'Mínimo 2 caracteres'),
  fecha_inicio: z.string().min(1, 'Requerido'),
  fecha_fin: z.string().min(1, 'Requerido'),
  nivel: z.string().min(2, 'Mínimo 2 caracteres'),
  precio: z.number().positive('Debe ser mayor a 0'),
  instructorNombre: z.string().min(2, 'Mínimo 2 caracteres'),
  instructorEmail: z.string().email('Email inválido'),
  requisitos: z.string().optional(),
  calificacion_promedio: z.number().min(0).max(5, 'Máximo 5'),
  estado: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Curso | null
  onSaved: () => void
}

export default function CourseFormDialog({ open, onOpenChange, course, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })
    const showToast = useToastStore((s) => s.show)  

  useEffect(() => {
    reset({
      nombre: course?.nombre ?? '',
      descripcion: course?.descripcion ?? '',
      categoria: course?.categoria ?? '',
      fecha_inicio: course?.fecha_inicio.slice(0, 10) ?? '',
      fecha_fin: course?.fecha_fin.slice(0, 10) ?? '',
      nivel: course?.nivel ?? '',
      precio: course?.precio ?? 0,
      instructorNombre: course?.instructor.nombre ?? '',
      instructorEmail: course?.instructor.email ?? '',
      requisitos: course?.requisitos.join(', ') ?? '',
      calificacion_promedio: course?.calificacion_promedio ?? 0,
      estado: course?.estado ?? 'activo',
    })
  }, [course, open, reset])

  const onSubmit = async (values: FormValues) => {
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      categoria: values.categoria,
      fecha_inicio: values.fecha_inicio,
      fecha_fin: values.fecha_fin,
      nivel: values.nivel,
      precio: values.precio,
      instructor: { nombre: values.instructorNombre, email: values.instructorEmail },
      requisitos: values.requisitos ? values.requisitos.split(',').map((r) => r.trim()).filter(Boolean) : [],
      calificacion_promedio: values.calificacion_promedio,
      estado: values.estado,
      contenidos: [],
    }
    if (course) await updateCourse(course._id, payload)
    else await createCourse(payload)
    showToast(course ? 'Curso actualizado' : 'Curso creado', 'success')
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? 'Editar curso' : 'Nuevo curso'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register('nombre')} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" rows={3} {...register('descripcion')} />
            {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Input id="categoria" {...register('categoria')} />
              {errors.categoria && <p className="text-sm text-destructive">{errors.categoria.message}</p>}
            </div>
            <div>
              <Label htmlFor="nivel">Nivel</Label>
              <Input id="nivel" placeholder="Básico, Intermedio..." {...register('nivel')} />
              {errors.nivel && <p className="text-sm text-destructive">{errors.nivel.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
              <Input id="fecha_inicio" type="date" {...register('fecha_inicio')} />
              {errors.fecha_inicio && <p className="text-sm text-destructive">{errors.fecha_inicio.message}</p>}
            </div>
            <div>
              <Label htmlFor="fecha_fin">Fecha de fin</Label>
              <Input id="fecha_fin" type="date" {...register('fecha_fin')} />
              {errors.fecha_fin && <p className="text-sm text-destructive">{errors.fecha_fin.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" type="number" step="0.01" {...register('precio', { valueAsNumber: true })} />
            {errors.precio && <p className="text-sm text-destructive">{errors.precio.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="calificacion_promedio">Calificación promedio</Label>
              <Input id="calificacion_promedio" type="number" step="0.1" min="0" max="5" {...register('calificacion_promedio', { valueAsNumber: true })} />
              {errors.calificacion_promedio && <p className="text-sm text-destructive">{errors.calificacion_promedio.message}</p>}
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" placeholder="activo, inactivo..." {...register('estado')} />
              {errors.estado && <p className="text-sm text-destructive">{errors.estado.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="instructorNombre">Instructor</Label>
              <Input id="instructorNombre" {...register('instructorNombre')} />
              {errors.instructorNombre && <p className="text-sm text-destructive">{errors.instructorNombre.message}</p>}
            </div>
            <div>
              <Label htmlFor="instructorEmail">Email del instructor</Label>
              <Input id="instructorEmail" type="email" {...register('instructorEmail')} />
              {errors.instructorEmail && <p className="text-sm text-destructive">{errors.instructorEmail.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="requisitos">Requisitos (separados por coma)</Label>
            <Input id="requisitos" placeholder="JavaScript, TypeScript básico" {...register('requisitos')} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
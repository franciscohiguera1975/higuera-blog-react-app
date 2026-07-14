// src/pages/public/CourseDetailPage.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse } from '@/api/courses.api'
import type { Curso } from '@/types/course.types'
import { Badge } from '@/components/ui/badge'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [curso, setCurso] = useState<Curso | null>(null)

  useEffect(() => { if (id) getCourse(id).then(setCurso) }, [id])

  if (!curso) return <div className="p-8 text-muted-foreground">Cargando...</div>

  return (
    <article className="mx-auto max-w-2xl space-y-4 p-8">
      <Link to="/" className="text-sm text-muted-foreground">← Volver</Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{curso.nombre}</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">{curso.categoria}</Badge>
          <Badge variant="outline">{curso.nivel}</Badge>
        </div>
      </div>
      <p className="whitespace-pre-line">{curso.descripcion}</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <span>Instructor: {curso.instructor.nombre}</span>
        <span>Precio: ${curso.precio}</span>
        <span>Inicio: {new Date(curso.fecha_inicio).toLocaleDateString()}</span>
        <span>Fin: {new Date(curso.fecha_fin).toLocaleDateString()}</span>
      </div>
      {curso.requisitos.length > 0 && (
        <div>
          <h2 className="font-medium">Requisitos</h2>
          <ul className="list-inside list-disc text-muted-foreground">
            {curso.requisitos.map((req) => <li key={req}>{req}</li>)}
          </ul>
        </div>
      )}
      <div>
        <h2 className="font-medium">Contenido</h2>
        {curso.contenidos.length === 0 && <p className="text-muted-foreground">Sin contenido cargado todavía.</p>}
        <ul className="space-y-1">
          {curso.contenidos.map((c) => (
            <li key={c._id} className="flex justify-between text-sm">
              <span>{c.titulo}</span>
              <span className="text-muted-foreground">{c.duracion} min</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
// src/pages/private/CoursesPage.tsx
import { useEffect, useState } from 'react'
import { getCourses, deleteCourse } from '@/api/courses.api'
import type { Curso } from '@/types/course.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CourseFormDialog from '@/components/private/CourseFormDialog'
import { useToastStore } from '@/store/toast.store'
import ConfirmDialog from '@/components/ConfirmDialog'

const ESTADO_STYLES: Record<string, string> = {
  activo: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Curso[]>([])
  const [editing, setEditing] = useState<Curso | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const showToast = useToastStore((s) => s.show)
  const [deleteTarget, setDeleteTarget] = useState<Curso | null>(null)

  const load = async () => {
    const result = await getCourses(1, 50)
    setCourses(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteCourse(deleteTarget._id)
    showToast('Curso eliminado', 'success')
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cursos</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>Nuevo curso</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((curso) => (
            <TableRow key={curso._id}>
              <TableCell>{curso.nombre}</TableCell>
              <TableCell>{curso.categoria}</TableCell>
              <TableCell>{curso.nivel}</TableCell>
              <TableCell>${curso.precio}</TableCell>
              <TableCell>
                <Badge variant="outline" className={ESTADO_STYLES[curso.estado] ?? 'bg-muted text-muted-foreground'}>
                  {curso.estado}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(curso); setDialogOpen(true) }}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setDeleteTarget(curso); }}>
                  Borrar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CourseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        course={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar curso"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
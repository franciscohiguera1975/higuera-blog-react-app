// src/pages/private/CategoriesPage.tsx
import { useEffect, useState } from 'react'
import { getCategories, deleteCategory } from '@/api/categories.api'
import type { Category } from '@/types/category.types'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CategoryFormDialog from '@/components/private/CategoryFormDialog'
import { useToastStore } from '@/store/toast.store'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const showToast = useToastStore((s) => s.show)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const load = async () => {
    const result = await getCategories({ limit: 50 })
    setCategories(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteCategory(deleteTarget.id)
    showToast('Categoría eliminada', 'success')
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>Nueva categoría</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Nombre</TableHead><TableHead /></TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(category); setDialogOpen(true) }}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(category)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar categoría"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
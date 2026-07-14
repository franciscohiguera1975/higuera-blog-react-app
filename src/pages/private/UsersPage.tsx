// src/pages/private/UsersPage.tsx
import { useEffect, useState } from 'react'
import { getUsers, deleteUser } from '@/api/users.api'
import type { User } from '@/types/user.types'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserFormDialog from '@/components/private/UserFormDialog'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = async () => {
    const result = await getUsers({ limit: 50 })
    setUsers(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    load()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }}>Nuevo usuario</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Usuario</TableHead><TableHead>Email</TableHead><TableHead /></TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(user); setDialogOpen(true) }}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                  Borrar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editing}
        onSaved={load}
      />
    </div>
  )
}
// src/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'
import { publicRoutes } from './publicRoutes'
import { privateRoutes } from './privateRoutes'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>{publicRoutes}</Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>{privateRoutes}</Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
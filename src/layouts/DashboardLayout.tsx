// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/private/Sidebar'
import DashboardHeader from '@/components/private/DashboardHeader'
import DashboardFooter from '@/components/private/DashboardFooter'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}
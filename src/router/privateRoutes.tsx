// src/router/privateRoutes.tsx
import { Route } from 'react-router-dom'
import DashboardHomePage from '@/pages/private/DashboardHomePage'
import CategoriesPage from '@/pages/private/CategoriesPage'
import ProfilePage from '@/pages/private/ProfilePage'
import PostsPage from '@/pages/private/PostsPage'
import CoursesPage from '../pages/private/CoursesPage'
import UsersPage from '../pages/private/UsersPage'

export const privateRoutes = [
  <Route key="dashboard" path="/dashboard" element={<DashboardHomePage />} />,
  <Route key="categorias" path="/categorias" element={<CategoriesPage />} />,
  <Route key="posts" path="/posts" element={<PostsPage />} />,
  <Route key="perfil" path="/perfil" element={<ProfilePage />} />,
  <Route key="cursos" path="/cursos" element={<CoursesPage />} />,
  <Route key="usuarios" path="/usuarios" element={<UsersPage />} />,
]
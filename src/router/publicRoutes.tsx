// src/router/publicRoutes.tsx
import { Route } from 'react-router-dom'
import HomePage from '@/pages/public/HomePage'
import PostDetailPage from '@/pages/public/PostDetailPage'
import CourseDetailPage from '@/pages/public/CourseDetailPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import GoogleCallbackPage from '@/pages/public/GoogleCallbackPage'

export const publicRoutes = [
  <Route key="home" path="/" element={<HomePage />} />,
  <Route key="post-detail" path="/posts/:id" element={<PostDetailPage />} />,
  <Route key="course-detail" path="/cursos/:id" element={<CourseDetailPage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
  <Route key="google-callback" path="/auth/google/callback" element={<GoogleCallbackPage />} />,
]
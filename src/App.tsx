// src/App.tsx
import { BrowserRouter } from 'react-router-dom'
import AppRouter from '@/router/AppRouter'
import ToastContainer from './components/ToastContainer'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  )
}
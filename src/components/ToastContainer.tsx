// src/components/ToastContainer.tsx
import { useEffect } from 'react'
import { useToastStore } from '@/store/toast.store'

export default function ToastContainer() {
  const { message, type, clear } = useToastStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 4000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  const colorClass =
    type === 'success' ? 'bg-green-600 text-white' : 'bg-destructive text-destructive-foreground'

  return (
    <div className={`fixed bottom-4 right-4 rounded-md px-4 py-3 text-sm shadow-lg ${colorClass}`}>
      {message}
    </div>
  )
}
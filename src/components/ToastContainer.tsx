// src/components/ToastContainer.tsx
import { useEffect } from 'react'
import { useToastStore } from '@/store/toast.store'

export default function ToastContainer() {
  const { message, clear } = useToastStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 4000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  return (
    <div className="fixed bottom-4 right-4 rounded-md bg-destructive px-4 py-3 text-sm text-destructive-foreground shadow-lg">
      {message}
    </div>
  )
}
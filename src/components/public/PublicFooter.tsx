// src/components/public/PublicFooter.tsx
export default function PublicFooter() {
  return (
    <footer className="border-t p-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} BlogApp Higuera
    </footer>
  )
}
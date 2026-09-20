// src/app/admin/layout.tsx
// Minimal layout para sa /admin/login (walang sidebar)
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
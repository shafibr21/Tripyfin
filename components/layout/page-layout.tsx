import type React from "react"
interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className || ""}`}>
      <div className="max-w-6xl mx-auto p-4 space-y-6">{children}</div>
    </div>
  )
}

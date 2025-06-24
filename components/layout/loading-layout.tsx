import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingLayoutProps {
  message?: string
}

export function LoadingLayout({ message = "Loading..." }: LoadingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

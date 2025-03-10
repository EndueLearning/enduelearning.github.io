import type { ReactNode } from "react"

interface FeaturedSimulatorProps {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function FeaturedSimulator({ title, description, icon, children }: FeaturedSimulatorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white rounded-full p-3 shadow-sm">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
      <div className="p-6 bg-white border-t border-gray-100">{children}</div>
    </div>
  )
}


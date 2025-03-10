import Link from "next/link"
import type { ReactNode } from "react"

interface SubjectCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  href: string
}

export default function SubjectCard({ title, description, icon, color, href }: SubjectCardProps) {
  return (
    <Link href={href} className="group block rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}


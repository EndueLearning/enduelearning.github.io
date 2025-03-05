import type React from "react"
import Link from "next/link"
import { Clock, Atom, Calculator, Microscope, Gamepad2, Globe } from "lucide-react"

interface Simulator {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
  subject: string
  difficulty: "Easy" | "Medium" | "Advanced"
}

const simulators: Simulator[] = [
  {
    id: "clock",
    title: "Interactive Clock",
    description: "Learn to tell time with our interactive analog and digital clock simulator.",
    icon: <Clock className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-100",
    href: "/simulators/clock",
    subject: "Math",
    difficulty: "Easy",
  },
  {
    id: "atom",
    title: "Atomic Structure",
    description: "Explore the structure of atoms and build your own elements.",
    icon: <Atom className="w-8 h-8 text-purple-500" />,
    color: "bg-purple-100",
    href: "/simulators/atomic-structure",
    subject: "Science",
    difficulty: "Medium",
  },
  {
    id: "calculator",
    title: "Graphing Calculator",
    description: "Plot functions and equations with our interactive graphing calculator.",
    icon: <Calculator className="w-8 h-8 text-green-500" />,
    color: "bg-green-100",
    href: "/simulators/graphing-calculator",
    subject: "Math",
    difficulty: "Advanced",
  },
  {
    id: "microscope",
    title: "Virtual Microscope",
    description: "Examine cells and microorganisms with our virtual microscope.",
    icon: <Microscope className="w-8 h-8 text-red-500" />,
    color: "bg-red-100",
    href: "/simulators/microscope",
    subject: "Science",
    difficulty: "Medium",
  },
  {
    id: "word-builder",
    title: "Word Builder",
    description: "Improve vocabulary by building words from letter blocks.",
    icon: <Gamepad2 className="w-8 h-8 text-yellow-500" />,
    color: "bg-yellow-100",
    href: "/simulators/word-builder",
    subject: "English",
    difficulty: "Easy",
  },
  {
    id: "solar-system",
    title: "Solar System Explorer",
    description: "Explore the planets and moons of our solar system in 3D.",
    icon: <Globe className="w-8 h-8 text-teal-500" />,
    color: "bg-teal-100",
    href: "/simulators/solar-system",
    subject: "Science",
    difficulty: "Medium",
  },
]

export default function SimulatorsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Interactive <span className="text-purple-600">Simulators</span>
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Explore concepts through our interactive simulators. These hands-on tools make learning engaging and fun.
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Subject:</span>
              <select className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="computer">Computer Science</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Difficulty:</span>
              <select className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simulators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {simulators.map((simulator) => (
            <Link
              key={simulator.id}
              href={simulator.href}
              className="group block rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`p-6 ${simulator.color}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white rounded-full p-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {simulator.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {simulator.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{simulator.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">{simulator.subject}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-sm text-gray-600">Difficulty: {simulator.difficulty}</span>
                </div>
              </div>
              <div className="bg-white p-4 border-t border-gray-100 text-purple-600 font-medium group-hover:bg-purple-50 transition-colors">
                Try Simulator →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}


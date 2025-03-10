"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Endue Learning
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/subjects/math" className="text-gray-700 hover:text-purple-600 transition-colors">
              Math
            </Link>
            <Link href="/subjects/science" className="text-gray-700 hover:text-purple-600 transition-colors">
              Science
            </Link>
            <Link href="/subjects/english" className="text-gray-700 hover:text-purple-600 transition-colors">
              English
            </Link>
            <Link href="/subjects/computer-science" className="text-gray-700 hover:text-purple-600 transition-colors">
              Computer
            </Link>
            <Link href="/simulators" className="text-gray-700 hover:text-purple-600 transition-colors">
              Simulators
            </Link>
            <Link href="/quizzes" className="text-gray-700 hover:text-purple-600 transition-colors">
              Quizzes
            </Link>
            <Link
              href="/store"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Store
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/subjects/math"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Math
              </Link>
              <Link
                href="/subjects/science"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Science
              </Link>
              <Link
                href="/subjects/english"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                English
              </Link>
              <Link
                href="/subjects/computer-science"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Computer
              </Link>
              <Link
                href="/simulators"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Simulators
              </Link>
              <Link
                href="/quizzes"
                className="text-gray-700 hover:text-purple-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link
                href="/store"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Store
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}


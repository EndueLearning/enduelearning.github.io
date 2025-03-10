import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Endue Learning</h2>
            <p className="text-gray-300 mb-4">
              Interactive educational resources for elementary, middle, and high school students. Making learning fun
              and engaging through simulators, games, and quizzes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/subjects/math" className="text-gray-300 hover:text-white transition-colors">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link href="/subjects/science" className="text-gray-300 hover:text-white transition-colors">
                  Science
                </Link>
              </li>
              <li>
                <Link href="/subjects/english" className="text-gray-300 hover:text-white transition-colors">
                  English & Language Arts
                </Link>
              </li>
              <li>
                <Link href="/subjects/computer-science" className="text-gray-300 hover:text-white transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-300 hover:text-white transition-colors">
                  Books & Printables
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@enduelearning.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>
                <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Endue Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Gamepad2, Lightbulb, Microscope, PenTool } from "lucide-react"
import SubjectCard from "@/components/subject-card"
import FeaturedSimulator from "@/components/featured-simulator"
import InteractiveClock from "@/components/simulators/interactive-clock"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fadeIn">
            Welcome to <span className="text-yellow-300">Endue Learning</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Interactive educational resources for elementary, middle, and high school students
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/simulators"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2"
            >
              Try Our Simulators <ArrowRight size={20} />
            </Link>
            <Link
              href="/quizzes"
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2"
            >
              Take a Quiz <Gamepad2 size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Explore <span className="text-purple-600">Subjects</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <SubjectCard
              title="Mathematics"
              description="Visualize concepts and solve problems with interactive tools"
              icon={<PenTool className="w-8 h-8 text-blue-500" />}
              color="bg-blue-100"
              href="/subjects/math"
            />
            <SubjectCard
              title="Science"
              description="Conduct virtual experiments and explore scientific principles"
              icon={<Microscope className="w-8 h-8 text-green-500" />}
              color="bg-green-100"
              href="/subjects/science"
            />
            <SubjectCard
              title="English & Language Arts"
              description="Improve vocabulary, grammar, and reading comprehension"
              icon={<BookOpen className="w-8 h-8 text-red-500" />}
              color="bg-red-100"
              href="/subjects/english"
            />
            <SubjectCard
              title="Computer Science"
              description="Learn coding and computational thinking through fun activities"
              icon={<Lightbulb className="w-8 h-8 text-yellow-500" />}
              color="bg-yellow-100"
              href="/subjects/computer-science"
            />
            <SubjectCard
              title="Interactive Games"
              description="Learn while having fun with our educational games"
              icon={<Gamepad2 className="w-8 h-8 text-purple-500" />}
              color="bg-purple-100"
              href="/games"
            />
            <SubjectCard
              title="Books & Printables"
              description="Browse our collection of educational resources"
              icon={<BookOpen className="w-8 h-8 text-teal-500" />}
              color="bg-teal-100"
              href="/store"
            />
          </div>
        </div>
      </section>

      {/* Featured Simulator */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Featured <span className="text-purple-600">Simulator</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <FeaturedSimulator
              title="Interactive Clock"
              description="Learn to tell time with our interactive clock simulator. Move the hands and see the digital time update in real-time."
              icon={<Clock className="w-10 h-10 text-purple-500" />}
            >
              <InteractiveClock />
            </FeaturedSimulator>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Enhance Learning?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Explore our interactive simulators, take quizzes, and discover educational resources to make learning fun
            and effective.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/simulators"
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-full transition-all"
            >
              Explore Simulators
            </Link>
            <Link
              href="/store"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition-all"
            >
              Visit Our Store
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}


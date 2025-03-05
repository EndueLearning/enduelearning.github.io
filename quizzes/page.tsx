"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Microscope, Calculator, Lightbulb, Award } from "lucide-react"

interface Quiz {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  subject: string
  questions: number
  difficulty: "Easy" | "Medium" | "Hard"
}

const quizzes: Quiz[] = [
  {
    id: "math-basics",
    title: "Math Basics",
    description:
      "Test your knowledge of basic math concepts including addition, subtraction, multiplication, and division.",
    icon: <Calculator className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-100",
    subject: "Math",
    questions: 10,
    difficulty: "Easy",
  },
  {
    id: "science-facts",
    title: "Science Facts",
    description: "Challenge yourself with questions about basic scientific principles and discoveries.",
    icon: <Microscope className="w-8 h-8 text-green-500" />,
    color: "bg-green-100",
    subject: "Science",
    questions: 15,
    difficulty: "Medium",
  },
  {
    id: "vocabulary-challenge",
    title: "Vocabulary Challenge",
    description: "Expand your vocabulary with this challenging word quiz.",
    icon: <BookOpen className="w-8 h-8 text-purple-500" />,
    color: "bg-purple-100",
    subject: "English",
    questions: 20,
    difficulty: "Medium",
  },
  {
    id: "computer-basics",
    title: "Computer Basics",
    description: "Test your knowledge of computer terminology and concepts.",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    color: "bg-yellow-100",
    subject: "Computer Science",
    questions: 12,
    difficulty: "Easy",
  },
  {
    id: "grammar-master",
    title: "Grammar Master",
    description: "Challenge your understanding of English grammar rules and usage.",
    icon: <BookOpen className="w-8 h-8 text-red-500" />,
    color: "bg-red-100",
    subject: "English",
    questions: 15,
    difficulty: "Hard",
  },
  {
    id: "science-experiments",
    title: "Science Experiments",
    description: "Test your knowledge of famous scientific experiments and their results.",
    icon: <Microscope className="w-8 h-8 text-teal-500" />,
    color: "bg-teal-100",
    subject: "Science",
    questions: 10,
    difficulty: "Hard",
  },
]

export default function QuizzesPage() {
  const [activeFilter, setActiveFilter] = useState({
    subject: "",
    difficulty: "",
  })

  // Filter quizzes based on selected filters
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (activeFilter.subject && quiz.subject !== activeFilter.subject) return false
    if (activeFilter.difficulty && quiz.difficulty !== activeFilter.difficulty) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Interactive <span className="text-purple-600">Quizzes</span>
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Test your knowledge and learn new facts with our interactive quizzes. Each correct answer helps you grow
          smarter!
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Subject:</span>
              <select
                className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={activeFilter.subject}
                onChange={(e) => setActiveFilter({ ...activeFilter, subject: e.target.value })}
              >
                <option value="">All Subjects</option>
                <option value="Math">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Difficulty:</span>
              <select
                className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={activeFilter.difficulty}
                onChange={(e) => setActiveFilter({ ...activeFilter, difficulty: e.target.value })}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Earn Points</h3>
                <p className="text-white/80">Get 10 points for each correct answer</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Learn As You Go</h3>
                <p className="text-white/80">Explanations for every answer</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-white/80">See your improvement over time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`p-6 ${quiz.color}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white rounded-full p-3 shadow-sm">{quiz.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{quiz.subject}</span>
                  <span className="text-sm bg-white px-2 py-1 rounded text-gray-700">{quiz.questions} Questions</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      quiz.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : quiz.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}


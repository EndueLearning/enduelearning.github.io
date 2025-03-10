import { Download, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  type: "book" | "printable"
  image: string
  subject: string
  ageGroup: string
}

const products: Product[] = [
  {
    id: "1",
    title: "Mathematics Made Easy",
    description: "A comprehensive guide to elementary mathematics with colorful illustrations and practice problems.",
    price: 24.99,
    type: "book",
    image: "/placeholder.svg?height=300&width=200",
    subject: "Math",
    ageGroup: "Elementary",
  },
  {
    id: "2",
    title: "Science Experiments at Home",
    description: "Collection of 50 safe and fun science experiments that can be done with household items.",
    price: 19.99,
    type: "book",
    image: "/placeholder.svg?height=300&width=200",
    subject: "Science",
    ageGroup: "Elementary, Middle School",
  },
  {
    id: "3",
    title: "English Grammar Worksheets",
    description: "Printable worksheets covering grammar, punctuation, and sentence structure.",
    price: 8.99,
    type: "printable",
    image: "/placeholder.svg?height=300&width=200",
    subject: "English",
    ageGroup: "Elementary, Middle School",
  },
  {
    id: "4",
    title: "Coding for Kids",
    description: "An introduction to programming concepts with fun activities and projects.",
    price: 22.99,
    type: "book",
    image: "/placeholder.svg?height=300&width=200",
    subject: "Computer Science",
    ageGroup: "Middle School, High School",
  },
  {
    id: "5",
    title: "Math Problem Solving Printables",
    description: "Word problems and critical thinking exercises for advanced math students.",
    price: 9.99,
    type: "printable",
    image: "/placeholder.svg?height=300&width=200",
    subject: "Math",
    ageGroup: "Middle School, High School",
  },
  {
    id: "6",
    title: "Language Arts Activities",
    description: "Creative writing prompts, vocabulary exercises, and reading comprehension worksheets.",
    price: 7.99,
    type: "printable",
    image: "/placeholder.svg?height=300&width=200",
    subject: "English",
    ageGroup: "Elementary, Middle School",
  },
]

export default function StorePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Educational <span className="text-purple-600">Resources</span>
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Browse our collection of educational books and printable resources to enhance learning at home and in the
          classroom.
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
              <span className="text-gray-700 font-medium">Type:</span>
              <select className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">All Types</option>
                <option value="book">Books</option>
                <option value="printable">Printables</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Age Group:</span>
              <select className="border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">All Ages</option>
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.type === "book" ? "Book" : "Printable"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">{product.subject}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{product.ageGroup}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{product.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
                  <button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md transition-colors">
                    {product.type === "book" ? (
                      <>
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}


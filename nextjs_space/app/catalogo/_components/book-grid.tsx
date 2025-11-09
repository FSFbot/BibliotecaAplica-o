
'use client'

import { useState } from 'react'
import BookCard from './book-card'
import { Search } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image_url: string | null
  total_copies: number
  available_copies: number
}

interface BookGridProps {
  books: Book[]
  userId: string
  userActiveLoansCount: number
  isAdmin: boolean
}

export default function BookGrid({ books, userId, userActiveLoansCount, isAdmin }: BookGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            userId={userId}
            userActiveLoansCount={userActiveLoansCount}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            Nenhum livro encontrado com "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  )
}

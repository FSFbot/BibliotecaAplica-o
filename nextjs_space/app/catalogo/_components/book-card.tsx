
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookOpen, Edit, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image_url: string | null
  total_copies: number
  available_copies: number
}

interface BookCardProps {
  book: Book
  userId: string
  userActiveLoansCount: number
  isAdmin: boolean
}

export default function BookCard({ book, userId, userActiveLoansCount, isAdmin }: BookCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const borrowedCount = book.total_copies - book.available_copies
  const canBorrow = book.available_copies > 0 && userActiveLoansCount < 3

  const handleBorrow = async () => {
    if (!canBorrow) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          userId,
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao emprestar livro')
      }
    } catch (error) {
      alert('Erro ao emprestar livro')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir "${book.title}"?`)) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erro ao excluir livro')
      }
    } catch (error) {
      alert('Erro ao excluir livro')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Book Cover */}
      <div className="relative aspect-[2/3] bg-slate-200">
        <Image
          src={book.cover_image_url || 'https://upload.wikimedia.org/wikipedia/commons/7/72/Placeholder_book.svg'}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-slate-600 mb-3 font-medium">
          {book.author}
        </p>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Availability Info */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">
              {borrowedCount} emprestados / {book.available_copies} disponíveis
            </span>
            <div className="flex gap-1">
              {Array.from({ length: book.total_copies }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < borrowedCount ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isAdmin ? (
            <button
              onClick={handleBorrow}
              disabled={!canBorrow || isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                canBorrow && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                'Emprestando...'
              ) : !canBorrow && book.available_copies === 0 ? (
                'Indisponível'
              ) : !canBorrow && userActiveLoansCount >= 3 ? (
                'Limite atingido'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Pegar Emprestado
                </span>
              )}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/books/edit/${book.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-3 rounded-lg font-medium transition-colors"
              >
                {isDeleting ? '...' : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

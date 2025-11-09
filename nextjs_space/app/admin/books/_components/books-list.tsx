
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Search, Eye } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image_url: string | null
  total_copies: number
  available_copies: number
}

interface BooksListProps {
  books: Book[]
}

export default function BooksList({ books }: BooksListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (bookId: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return
    
    setDeletingId(bookId)
    try {
      const response = await fetch(`/api/books/${bookId}`, {
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
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="max-w-md">
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

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{books.length}</div>
            <div className="text-slate-600">Total de Livros</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {books.reduce((sum, book) => sum + book.total_copies, 0)}
            </div>
            <div className="text-slate-600">Total de Exemplares</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {books.reduce((sum, book) => sum + (book.total_copies - book.available_copies), 0)}
            </div>
            <div className="text-slate-600">Emprestados</div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Livro</th>
                <th className="text-left p-4 font-semibold text-slate-700">Autor</th>
                <th className="text-center p-4 font-semibold text-slate-700">Exemplares</th>
                <th className="text-center p-4 font-semibold text-slate-700">Disponíveis</th>
                <th className="text-center p-4 font-semibold text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBooks.map((book) => {
                const borrowedCount = book.total_copies - book.available_copies
                
                return (
                  <tr key={book.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={book.cover_image_url || 'https://upload.wikimedia.org/wikipedia/commons/7/72/Placeholder_book.svg'}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{book.title}</div>
                          <div className="text-sm text-slate-500 line-clamp-2 max-w-xs">
                            {book.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{book.author}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {book.total_copies}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        book.available_copies > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available_copies}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/books/edit/${book.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id, book.title)}
                          disabled={deletingId === book.id}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-2 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          {deletingId === book.id ? '...' : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            {searchTerm ? `Nenhum livro encontrado com "${searchTerm}"` : 'Nenhum livro cadastrado'}
          </p>
        </div>
      )}
    </div>
  )
}

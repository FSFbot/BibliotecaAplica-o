
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Save, ArrowLeft, Book, User, FileText, Image as ImageIcon, Hash } from 'lucide-react'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image_url: string | null
  total_copies: number
}

interface BookFormProps {
  book?: Book
}

export default function BookForm({ book }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    cover_image_url: book?.cover_image_url || '',
    total_copies: book?.total_copies || 4,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_copies' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = book ? `/api/books/${book.id}` : '/api/books'
      const method = book ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // When updating, preserve the available_copies logic
          ...(book ? {} : { available_copies: formData.total_copies })
        }),
      })

      if (response.ok) {
        router.push('/admin/books')
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao salvar livro')
      }
    } catch (error) {
      setError('Erro ao salvar livro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {book ? 'Editar Livro' : 'Novo Livro'}
        </h2>
        <Link
          href="/admin/books"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                <Book className="w-4 h-4 inline mr-2" />
                Título *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Digite o título do livro"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Autor *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Digite o nome do autor"
                required
              />
            </div>

            <div>
              <label htmlFor="total_copies" className="block text-sm font-medium text-slate-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de Exemplares *
              </label>
              <input
                id="total_copies"
                name="total_copies"
                type="number"
                min="1"
                max="50"
                value={formData.total_copies}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="cover_image_url" className="block text-sm font-medium text-slate-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                URL da Capa (opcional)
              </label>
              <input
                id="cover_image_url"
                name="cover_image_url"
                type="url"
                value={formData.cover_image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://i.ytimg.com/vi/QhcQeqt0ieM/maxresdefault.jpg"
              />
            </div>
          </div>

          {/* Right Column - Preview and Description */}
          <div className="space-y-6">
            {/* Book Cover Preview */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pré-visualização da Capa
              </label>
              <div className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
                {formData.cover_image_url ? (
                  <Image
                    src={formData.cover_image_url}
                    alt="Pré-visualização da capa"
                    fill
                    className="object-cover"
                    onError={() => {
                      setFormData(prev => ({ ...prev, cover_image_url: '' }))
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Book className="w-12 h-12 mb-2" />
                    <span className="text-sm">Sem capa</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Digite uma breve descrição ou sinopse do livro"
            required
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Salvando...' : 'Salvar Livro'}
          </button>
          <Link
            href="/admin/books"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

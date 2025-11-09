
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../../api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import BooksList from './_components/books-list'

export const dynamic = "force-dynamic"

export default async function AdminBooks() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  })

  if (!user || user.role !== 1) {
    redirect('/catalogo')
  }

  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              Gerenciar Livros
            </h1>
            <p className="text-lg text-slate-600">
              Adicione, edite ou remova livros do acervo
            </p>
          </div>
          
          <Link
            href="/admin/books/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Livro
          </Link>
        </div>

        <BooksList books={books} />
      </main>
    </div>
  )
}

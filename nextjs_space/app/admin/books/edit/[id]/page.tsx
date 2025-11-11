
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import BookForm from '../../_components/book-form'
import { Edit } from 'lucide-react'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'

interface EditBookProps {
  params: {
    id: string
  }
}

export default async function EditBook({ params }: EditBookProps) {
  const { authOptions } = await import('../../../../api/auth/[...nextauth]/auth-options')
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

  const book = await prisma.book.findUnique({
    where: { id: params.id }
  })

  if (!book) {
    redirect('/admin/books')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Edit className="w-8 h-8 text-emerald-600" />
            Editar Livro
          </h1>
          <p className="text-lg text-slate-600">
            Atualize as informações do livro
          </p>
        </div>

        <BookForm book={book} />
      </main>
    </div>
  )
}

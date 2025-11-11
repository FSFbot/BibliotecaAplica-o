
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import BookForm from '../_components/book-form'
import { Plus } from 'lucide-react'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'

export default async function NewBook() {
  const { authOptions } = await import('../../../api/auth/[...nextauth]/auth-options')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Plus className="w-8 h-8 text-emerald-600" />
            Adicionar Novo Livro
          </h1>
          <p className="text-lg text-slate-600">
            Preencha as informações do livro
          </p>
        </div>

        <BookForm />
      </main>
    </div>
  )
}

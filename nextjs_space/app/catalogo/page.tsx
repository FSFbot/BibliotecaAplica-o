
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import BookGrid from './_components/book-grid'
import { Search } from 'lucide-react'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'

export default async function Catalogo() {
  const { authOptions } = await import('../api/auth/[...nextauth]/auth-options')
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' }
  })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      loans: {
        where: { returned: false },
        include: { book: true }
      }
    }
  })

  const userActiveLoansCount = user?.loans?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Search className="w-8 h-8 text-emerald-600" />
            Catálogo de Livros
          </h1>
          <p className="text-lg text-slate-600">
            Explore nossa coleção e faça seus empréstimos
          </p>
        </div>

        <BookGrid 
          books={books} 
          userId={user?.id || ''} 
          userActiveLoansCount={userActiveLoansCount}
          isAdmin={user?.role === 1}
        />
      </main>
    </div>
  )
}

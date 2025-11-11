
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import AdminLoansList from './_components/admin-loans-list'
import { Users } from 'lucide-react'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'

export default async function AdminLoans() {
  const { authOptions } = await import('../../api/auth/[...nextauth]/auth-options')
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

  const loans = await prisma.loan.findMany({
    where: { returned: false },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      book: {
        select: { id: true, title: true, author: true, cover_image_url: true }
      }
    },
    orderBy: { loan_date: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600" />
            Empréstimos Ativos
          </h1>
          <p className="text-lg text-slate-600">
            Acompanhe todos os empréstimos em andamento
          </p>
        </div>

        <AdminLoansList loans={loans} />
      </main>
    </div>
  )
}

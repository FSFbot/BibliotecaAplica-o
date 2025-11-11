
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation'
import LoansList from './_components/loans-list'
import { Clock } from 'lucide-react'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'

export default async function Emprestimos() {
  const { authOptions } = await import('../api/auth/[...nextauth]/auth-options')
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      loans: {
        where: { returned: false },
        include: { book: true },
        orderBy: { loan_date: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  // Redirect admins to their loans page
  if (user.role === 1) {
    redirect('/admin/loans')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation user={user} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Clock className="w-8 h-8 text-emerald-600" />
            Meus Empréstimos
          </h1>
          <p className="text-lg text-slate-600">
            Acompanhe seus livros emprestados e prazos de devolução
          </p>
        </div>

        <LoansList loans={user.loans || []} />
      </main>
    </div>
  )
}

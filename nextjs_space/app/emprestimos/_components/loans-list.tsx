
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, RotateCcw, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Loan {
  id: string
  loan_date: Date
  return_deadline: Date
  book: {
    id: string
    title: string
    author: string
    cover_image_url: string | null
  }
}

interface LoansListProps {
  loans: Loan[]
}

export default function LoansList({ loans }: LoansListProps) {
  const [returningLoans, setReturningLoans] = useState<Set<string>>(new Set())
  const router = useRouter()

  const handleReturn = async (loanId: string) => {
    setReturningLoans(prev => new Set(prev).add(loanId))
    
    try {
      const response = await fetch(`/api/loans/${loanId}/return`, {
        method: 'POST',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erro ao devolver livro')
      }
    } catch (error) {
      alert('Erro ao devolver livro')
    } finally {
      setReturningLoans(prev => {
        const newSet = new Set(prev)
        newSet.delete(loanId)
        return newSet
      })
    }
  }

  const getDaysRemaining = (returnDeadline: Date) => {
    return differenceInDays(new Date(returnDeadline), new Date())
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          Nenhum empréstimo ativo
        </h2>
        <p className="text-slate-500">
          Você não possui livros emprestados no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Livros Emprestados ({loans.length}/3)
          </h2>
          <div className="w-full bg-slate-200 rounded-full h-2 max-w-xs">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(loans.length / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {loans.map((loan) => {
        const daysRemaining = getDaysRemaining(loan.return_deadline)
        const isOverdue = daysRemaining < 0
        const isDueSoon = daysRemaining <= 2 && daysRemaining >= 0
        const isReturning = returningLoans.has(loan.id)

        return (
          <div key={loan.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex gap-6">
                {/* Book Cover */}
                <div className="relative w-20 h-28 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                  <Image
                    src={loan.book.cover_image_url || 'https://upload.wikimedia.org/wikipedia/commons/7/72/Placeholder_book.svg'}
                    alt={loan.book.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Loan Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 mb-1">
                        {loan.book.title}
                      </h3>
                      <p className="text-slate-600 font-medium">
                        {loan.book.author}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isOverdue 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : isDueSoon
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {isOverdue 
                        ? `Atrasado ${Math.abs(daysRemaining)} dias` 
                        : daysRemaining === 0
                        ? 'Vence hoje'
                        : `${daysRemaining} dias restantes`
                      }
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Emprestado: {format(new Date(loan.loan_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-slate-600'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        Prazo: {format(new Date(loan.return_deadline), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  {/* Return Button */}
                  <button
                    onClick={() => handleReturn(loan.id)}
                    disabled={isReturning}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isReturning ? 'Devolvendo...' : 'Devolver Livro'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

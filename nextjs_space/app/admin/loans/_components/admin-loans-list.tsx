
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, AlertTriangle, Search, User, Book } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Loan {
  id: string
  loan_date: Date
  return_deadline: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  book: {
    id: string
    title: string
    author: string
    cover_image_url: string | null
  }
}

interface AdminLoansListProps {
  loans: Loan[]
}

export default function AdminLoansList({ loans }: AdminLoansListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredLoans = loans.filter(loan =>
    loan.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDaysRemaining = (returnDeadline: Date) => {
    return differenceInDays(new Date(returnDeadline), new Date())
  }

  const overdueLoans = filteredLoans.filter(loan => getDaysRemaining(loan.return_deadline) < 0)
  const dueSoonLoans = filteredLoans.filter(loan => {
    const days = getDaysRemaining(loan.return_deadline)
    return days >= 0 && days <= 2
  })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuário ou livro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {filteredLoans.length}
          </div>
          <div className="text-slate-600">Total de Empréstimos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {dueSoonLoans.length}
          </div>
          <div className="text-slate-600">Vencem em 2 dias</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {overdueLoans.length}
          </div>
          <div className="text-slate-600">Atrasados</div>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum empréstimo ativo'}
          </h2>
          <p className="text-slate-500">
            {searchTerm ? `Nenhum empréstimo encontrado para "${searchTerm}"` : 'Não há empréstimos ativos no momento.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">Usuário</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Livro</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Emprestado em</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Prazo</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLoans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan.return_deadline)
                  const isOverdue = daysRemaining < 0
                  const isDueSoon = daysRemaining <= 2 && daysRemaining >= 0
                  
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {loan.user.name || 'Usuário sem nome'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {loan.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={loan.book.cover_image_url || 'https://i.ytimg.com/vi/ITe3AfVCGYk/maxresdefault.jpg'}
                              alt={loan.book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {loan.book.title}
                            </div>
                            <div className="text-sm text-slate-500">
                              {loan.book.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(loan.loan_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className={`flex items-center justify-center gap-1 text-sm ${
                          isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-slate-600'
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                          {format(new Date(loan.return_deadline), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

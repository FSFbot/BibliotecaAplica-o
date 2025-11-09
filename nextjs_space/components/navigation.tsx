
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { BookOpen, User, History, Settings, LogOut, Users, Plus } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  role: number
  loans?: any[]
}

interface NavigationProps {
  user: User | null
}

export default function Navigation({ user }: NavigationProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (!user) return null

  const isAdmin = user.role === 1

  return (
    <header className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/catalogo" className="flex items-center gap-3 text-xl font-bold hover:text-emerald-400 transition-colors">
            <BookOpen className="w-6 h-6" />
            📚 Biblioteca Escolar
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/catalogo" 
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Catálogo
            </Link>
            
            {!isAdmin && (
              <Link 
                href="/emprestimos" 
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <History className="w-4 h-4" />
                Meus Empréstimos
              </Link>
            )}

            {isAdmin && (
              <>
                <Link 
                  href="/admin/books" 
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Gerenciar Livros
                </Link>
                <Link 
                  href="/admin/loans" 
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Empréstimos Ativos
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{user.name || user.email}</span>
              {isAdmin && (
                <span className="bg-emerald-600 text-xs px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

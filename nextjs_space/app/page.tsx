import Link from 'next/link'
import { BookOpen, Users, Clock, Star } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              📚 Biblioteca Escolar
            </h1>
            <nav className="flex gap-6">
              <Link 
                href="/login" 
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="border border-white/20 hover:bg-white/10 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Biblioteca"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in">
            Bem-vindo à nossa biblioteca!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubra um universo de conhecimento. Acesse nosso catálogo online e reserve seus livros favoritos.
          </p>
          <Link 
            href="/login" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-medium inline-block transition-colors"
          >
            Acessar Catálogo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12 text-slate-700 flex items-center justify-center gap-3">
          <Star className="w-8 h-8 text-emerald-600" />
          Recursos da Biblioteca
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold mb-4 text-center text-slate-700">Acervo Completo</h4>
            <p className="text-slate-600 text-center">
              Literatura clássica, contemporânea e acadêmica. Mais de 1000 títulos disponíveis.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold mb-4 text-center text-slate-700">Acesso Fácil</h4>
            <p className="text-slate-600 text-center">
              Sistema online intuitivo para buscar, reservar e gerenciar seus empréstimos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold mb-4 text-center text-slate-700">Prazo Flexível</h4>
            <p className="text-slate-600 text-center">
              7 dias de empréstimo com possibilidade de renovação. Até 3 livros por vez.
            </p>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-700">
            Destaques da Semana
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', icon: '📖' },
              { title: 'Dom Casmurro', author: 'Machado de Assis', icon: '📚' },
              { title: 'Capitães da Areia', author: 'Jorge Amado', icon: '✍️' }
            ].map((book, index) => (
              <div key={index} className="text-center p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{book.icon}</div>
                <h4 className="text-xl font-bold mb-2 text-slate-700">{book.title}</h4>
                <p className="text-slate-600">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white text-center py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; 2025 Biblioteca Escolar - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

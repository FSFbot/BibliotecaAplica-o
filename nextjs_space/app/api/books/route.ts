
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: 'asc' }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Books fetch error:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar livros' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user || user.role !== 1) {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { title, author, description, cover_image_url, total_copies } = await request.json()

    if (!title || !author || !description || total_copies < 1) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        cover_image_url: cover_image_url || null,
        total_copies,
        available_copies: total_copies
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Book creation error:', error)
    return NextResponse.json(
      { message: 'Erro ao criar livro' },
      { status: 500 }
    )
  }
}

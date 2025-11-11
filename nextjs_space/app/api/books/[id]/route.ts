
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!book) {
      return NextResponse.json(
        { message: 'Livro não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Book fetch error:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar livro' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authOptions } = await import('../../auth/[...nextauth]/auth-options')
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

    // Get current book to calculate new available_copies
    const currentBook = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!currentBook) {
      return NextResponse.json(
        { message: 'Livro não encontrado' },
        { status: 404 }
      )
    }

    // Calculate how many copies are currently borrowed
    const borrowedCount = currentBook.total_copies - currentBook.available_copies
    
    // Make sure we don't set total_copies less than borrowed copies
    if (total_copies < borrowedCount) {
      return NextResponse.json(
        { message: `Não é possível reduzir para ${total_copies} exemplares pois ${borrowedCount} estão emprestados` },
        { status: 400 }
      )
    }

    // Update available_copies based on the difference
    const newAvailableCopies = total_copies - borrowedCount

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title,
        author,
        description,
        cover_image_url: cover_image_url || null,
        total_copies,
        available_copies: newAvailableCopies
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('Book update error:', error)
    return NextResponse.json(
      { message: 'Erro ao atualizar livro' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authOptions } = await import('../../auth/[...nextauth]/auth-options')
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

    // Check if book has active loans
    const activeLoans = await prisma.loan.findFirst({
      where: {
        bookId: params.id,
        returned: false
      }
    })

    if (activeLoans) {
      return NextResponse.json(
        { message: 'Não é possível excluir um livro com empréstimos ativos' },
        { status: 400 }
      )
    }

    await prisma.book.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Livro excluído com sucesso' })
  } catch (error) {
    console.error('Book deletion error:', error)
    return NextResponse.json(
      { message: 'Erro ao excluir livro' },
      { status: 500 }
    )
  }
}


import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { addDays } from 'date-fns'

export const dynamic = "force-dynamic"
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function POST(request: Request) {
  try {
    const { authOptions } = await import('../auth/[...nextauth]/auth-options')
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { bookId, userId } = await request.json()

    // Verify the user making the request matches the userId
    const requestingUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!requestingUser || requestingUser.id !== userId) {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return NextResponse.json(
        { message: 'Livro não encontrado' },
        { status: 404 }
      )
    }

    if (book.available_copies <= 0) {
      return NextResponse.json(
        { message: 'Livro indisponível no momento' },
        { status: 400 }
      )
    }

    // Check if user has already borrowed this book
    const existingLoan = await prisma.loan.findFirst({
      where: {
        userId,
        bookId,
        returned: false
      }
    })

    if (existingLoan) {
      return NextResponse.json(
        { message: 'Você já possui este livro emprestado' },
        { status: 400 }
      )
    }

    // Check if user has reached the loan limit (3 books)
    const userActiveLoans = await prisma.loan.count({
      where: {
        userId,
        returned: false
      }
    })

    if (userActiveLoans >= 3) {
      return NextResponse.json(
        { message: 'Você já atingiu o limite de 3 livros emprestados' },
        { status: 400 }
      )
    }

    // Create loan with 7-day return deadline
    const returnDeadline = addDays(new Date(), 7)
    
    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        return_deadline: returnDeadline
      },
      include: {
        book: true,
        user: true
      }
    })

    // Update book available copies
    await prisma.book.update({
      where: { id: bookId },
      data: {
        available_copies: {
          decrement: 1
        }
      }
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error('Loan creation error:', error)
    return NextResponse.json(
      { message: 'Erro ao criar empréstimo' },
      { status: 500 }
    )
  }
}

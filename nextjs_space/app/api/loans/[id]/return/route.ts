
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Find the loan
    const loan = await prisma.loan.findUnique({
      where: { id: params.id },
      include: { user: true, book: true }
    })

    if (!loan) {
      return NextResponse.json(
        { message: 'Empréstimo não encontrado' },
        { status: 404 }
      )
    }

    if (loan.returned) {
      return NextResponse.json(
        { message: 'Este livro já foi devolvido' },
        { status: 400 }
      )
    }

    // Get requesting user
    const requestingUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!requestingUser) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Check if user owns this loan or is admin
    if (requestingUser.id !== loan.userId && requestingUser.role !== 1) {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Mark loan as returned
    await prisma.loan.update({
      where: { id: params.id },
      data: { returned: true }
    })

    // Update book available copies
    await prisma.book.update({
      where: { id: loan.bookId },
      data: {
        available_copies: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ message: 'Livro devolvido com sucesso' })
  } catch (error) {
    console.error('Loan return error:', error)
    return NextResponse.json(
      { message: 'Erro ao devolver livro' },
      { status: 500 }
    )
  }
}

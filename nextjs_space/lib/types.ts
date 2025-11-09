
export interface User {
  id: string
  name: string | null
  email: string
  password?: string
  role: number // 1 = admin, 2 = regular user
  emailVerified?: Date | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image_url: string | null
  total_copies: number
  available_copies: number
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  userId: string
  bookId: string
  loan_date: Date
  return_deadline: Date
  returned: boolean
  createdAt: Date
  updatedAt: Date
  user?: User
  book?: Book
}

export interface BookWithLoanInfo extends Book {
  borrowedCount: number
  canBorrow: boolean
}

export interface LoanWithRelations extends Omit<Loan, 'user' | 'book'> {
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

export interface UserWithLoans extends User {
  loans: LoanWithRelations[]
}

export interface BookFormData {
  title: string
  author: string
  description: string
  cover_image_url: string
  total_copies: number
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface LoanStats {
  totalLoans: number
  activeLoans: number
  overdueLoans: number
  dueSoonLoans: number
}

export interface BookStats {
  totalBooks: number
  totalCopies: number
  availableCopies: number
  borrowedCopies: number
}

export interface UserStats {
  totalUsers: number
  adminUsers: number
  regularUsers: number
  activeUsers: number
}

export interface LibraryStats {
  books: BookStats
  loans: LoanStats
  users: UserStats
}

// NextAuth type extensions
declare module "next-auth" {
  interface User {
    role: number
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: number
  }
}

// Utility types
export type UserRole = 1 | 2 // 1 = admin, 2 = regular user

export type LoanStatus = 'active' | 'returned' | 'overdue' | 'due_soon'

export type BookAvailability = 'available' | 'limited' | 'unavailable'

export type SortOrder = 'asc' | 'desc'

export type BookSortField = 'title' | 'author' | 'createdAt' | 'available_copies'

export type LoanSortField = 'loan_date' | 'return_deadline' | 'user_name' | 'book_title'

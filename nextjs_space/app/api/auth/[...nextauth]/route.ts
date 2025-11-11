import NextAuth from 'next-auth'
import { authOptions } from './auth-options'

// Force dynamic rendering and disable static optimization
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

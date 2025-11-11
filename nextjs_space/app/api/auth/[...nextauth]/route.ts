import NextAuth from 'next-auth'

// Force dynamic rendering and disable static optimization
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

// Lazy load authOptions to prevent build-time database connection
const getHandler = async () => {
  const { authOptions } = await import('./auth-options')
  return NextAuth(authOptions)
}

export async function GET(req: Request, context: any) {
  const handler = await getHandler()
  return handler(req, context)
}

export async function POST(req: Request, context: any) {
  const handler = await getHandler()
  return handler(req, context)
}

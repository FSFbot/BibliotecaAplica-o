import NextAuth from 'next-auth'

// Lazy load authOptions to prevent build-time database connection
const getHandler = async () => {
  const { authOptions } = await import('./auth-options')  // ✅ Importado em runtime
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
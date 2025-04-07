import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token

  // Define protected routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/chat")

  // Define auth routes
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", req.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/register"],
}


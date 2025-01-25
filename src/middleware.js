import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /protected, /login)
  const path = request.nextUrl.pathname

  // Define paths that are considered public (no auth required)
  const isPublicPath = path === "/login" || path === "/register" || path === "/";

  // Check if the user has a token
  const token = request.cookies.get("token")?.value || ""

  // If the user is on a public path and has a token, redirect to /blog
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/blog", request.url))
  }

  // If the user doesn't have a token and the path is not public, redirect to /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/blog", "/blog/:path*", "/login", "/register"],
}


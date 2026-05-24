// frontend/middleware.ts
import { auth } from "@/config/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"

  // 1. If logged in and trying to access /login, kick them to dashboard
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }

  // 2. If NOT logged in and trying to access protected apps, kick them to /login
  if (!isLoggedIn && !isLoginPage && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
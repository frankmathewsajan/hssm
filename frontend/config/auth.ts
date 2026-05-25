// frontend/config/auth.ts
import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"

type AuthUser = {
  role?: string
  school_code?: string
  token?: string
  refreshToken?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password" },
        remember_me: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        try {
          // Sending request to local Django server
          const res = await fetch(process.env.DJANGO_AUTH_LOGIN_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              remember_me: credentials.remember_me || false
            }),
          })

          const data = await res.json()

          if (res.ok && data.token) {
            return {
              id: credentials.username as string, 
              name: data.name,
              role: data.role,
              school_code: data.school_code,
              token: data.token, // The Django JWT access token
              refreshToken: data.refresh_token // The Django JWT refresh token
            }
          }
          
          throw new CredentialsSignin()
        } catch {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.school_code = user.school_code
        token.token = user.token
        token.refreshToken = (user as AuthUser).refreshToken
      }

      // Token rotation logic
      if (token.token && typeof token.token === "string") {
        try {
          const decodedPayload = JSON.parse(Buffer.from(token.token.split('.')[1], 'base64').toString())
          const now = Math.floor(Date.now() / 1000)

          // If token expires in less than 30 seconds, refresh it
          if (decodedPayload.exp && decodedPayload.exp < now + 30) {
            const refreshUrl = process.env.DJANGO_AUTH_LOGIN_URL!.replace("/login", "/refresh")
            const res = await fetch(refreshUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: token.refreshToken })
            })

            if (res.ok) {
              const refreshedData = await res.json()
              token.token = refreshedData.access
              // We keep the same refresh token unless Django also rotated it
              if (refreshedData.refresh) {
                token.refreshToken = refreshedData.refresh
              }
            } else {
              // Failed to refresh (e.g. refresh token expired)
              token.error = "RefreshAccessTokenError"
            }
          }
        } catch (error) {
          console.error("Error refreshing token", error)
          token.error = "RefreshAccessTokenError"
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.school_code = token.school_code as string
        session.user.token = token.token as string
        if (token.error) {
          ;(session as { error?: string }).error = token.error as string
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
  }
})
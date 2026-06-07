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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        remember_me: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        try {
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
              token: data.token,            // Django JWT Access Token
              refreshToken: data.refresh_token // Django JWT Refresh Token
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
      // Initial authenticating session initialization pass
      if (user) {
        token.role = user.role
        token.school_code = user.school_code
        token.token = user.token
        token.refreshToken = (user as AuthUser).refreshToken
        // Clear old errors on fresh login
        delete token.error 
      }

      // Background Token Rotation (RTR) Validation Engine
      if (token.token && typeof token.token === "string" && !token.error) {
        try {
          const decodedPayload = JSON.parse(Buffer.from(token.token.split('.')[1], 'base64').toString())
          const now = Math.floor(Date.now() / 1000)

          // Proactively rotate access keys if expiry window drops below 30 seconds
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
              
              if (refreshedData.refresh) {
                token.refreshToken = refreshedData.refresh
              }
              // Clear any historic refresh errors if recovery passes
              delete token.error 
            } else {
              // Both Access AND Refresh tokens are dead. Mark session as expired.
              console.warn("JWT Refresh token has completely expired. Marking session for eviction.")
              token.error = "RefreshAccessTokenError"
            }
          }
        } catch (error) {
          console.error("Error running validation token rotation:", error)
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
        
        // Pass the error explicitly to client wrappers/layouts
        if (token.error) {
          ;(session as any).error = token.error
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/", 
  }
})
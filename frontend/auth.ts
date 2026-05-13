import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

import { loginSchema } from "@/lib/validations/auth"

const DJANGO_LOGIN_URL =
  process.env.DJANGO_AUTH_LOGIN_URL ?? "http://localhost:8000/api/auth/login"

const djangoLoginResponseSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  school_code: z.string().min(1),
})

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials"
}

class LoginServiceError extends CredentialsSignin {
  code = "login_service_unavailable"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials)

        if (!parsedCredentials.success) {
          throw new InvalidCredentialsError()
        }

        let response: Response

        try {
          response = await fetch(DJANGO_LOGIN_URL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: parsedCredentials.data.username,
              password: parsedCredentials.data.password,
            }),
            cache: "no-store",
          })
        } catch {
          throw new LoginServiceError()
        }

        if (response.status === 401) {
          throw new InvalidCredentialsError()
        }

        if (!response.ok) {
          throw new LoginServiceError()
        }

        let responseBody: unknown

        try {
          responseBody = await response.json()
        } catch {
          throw new LoginServiceError()
        }

        const parsedUser = djangoLoginResponseSchema.safeParse(responseBody)

        if (!parsedUser.success) {
          throw new LoginServiceError()
        }

        return {
          id: parsedCredentials.data.username,
          token: parsedUser.data.token,
          name: parsedUser.data.name,
          role: parsedUser.data.role,
          school_code: parsedUser.data.school_code,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token
        token.name = user.name
        token.role = user.role
        token.school_code = user.school_code
      }

      return token
    },
    async session({ session, token }) {
      session.user.token = typeof token.token === "string" ? token.token : ""
      session.user.name = typeof token.name === "string" ? token.name : null
      session.user.role = typeof token.role === "string" ? token.role : ""
      session.user.school_code =
        typeof token.school_code === "string" ? token.school_code : ""

      return session
    },
  },
})

import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      token: string
      role: string
      school_code: string
    } & DefaultSession["user"]
  }

  interface User {
    token: string
    role: string
    school_code: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string
    role?: string
    school_code?: string
  }
}

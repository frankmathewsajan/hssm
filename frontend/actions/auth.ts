"use server"

import { signIn, signOut } from "@/config/auth"
import { unstable_rethrow } from "next/navigation"
import { AuthError } from "next-auth"

export type LoginActionState = { message?: string; ok?: boolean }

export async function loginAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  try {
    const result = await signIn("credentials", {
      ...Object.fromEntries(formData.entries()),
      redirect: false,
      callbackUrl: "/dashboard",
    })
    if (result?.error) {
      return { message: result.error }
    }
    return { ok: true }
  } catch (error) {
    // Preserve original error handling
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid username or password." }
        default:
          return { message: "Something went wrong." }
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
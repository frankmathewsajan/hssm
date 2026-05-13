"use server"

import { AuthError, CredentialsSignin } from "next-auth"

import { signIn, signOut } from "@/auth"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

export type LoginActionState = {
  message?: string
  fieldErrors?: Partial<Record<keyof LoginFormValues, string[]>>
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsedCredentials = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!parsedCredentials.success) {
    return {
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsedCredentials.error.flatten().fieldErrors,
    }
  }

  try {
    await signIn("credentials", {
      username: parsedCredentials.data.username,
      password: parsedCredentials.data.password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        message:
          error.code === "login_service_unavailable"
            ? "Unable to reach the authentication service. Please try again."
            : "Invalid username or password.",
      }
    }

    if (error instanceof AuthError) {
      return {
        message: "Unable to sign in right now. Please try again.",
      }
    }

    throw error
  }

  return {}
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  })
}

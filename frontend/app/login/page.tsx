import type { Metadata } from "next"

import { LoginForm } from "@/app/login/login-form"

export const metadata: Metadata = {
  title: "Login | HSS Manager",
  description: "Sign in to HSS Manager.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7faf7_0%,#eef6f1_42%,#f8fafc_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_400px]">
        <section className="hidden max-w-xl lg:block">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-950 text-xl font-semibold text-white shadow-sm">
            H
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-slate-950">
            Secure school operations, ready when you are.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Access the HSS Manager dashboard with your assigned school account.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, LogIn } from "lucide-react"
import { useActionState, useTransition } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { loginAction, type LoginActionState } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

const initialState: LoginActionState = {
  message: "",
  fieldErrors: {},
}

export function LoginForm() {
  const [isTransitionPending, startTransition] = useTransition()
  const [state, formAction, isActionPending] = useActionState(
    loginAction,
    initialState
  )
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const isPending = isActionPending || isTransitionPending
  const usernameError =
    form.formState.errors.username?.message ?? state.fieldErrors?.username?.[0]
  const passwordError =
    form.formState.errors.password?.message ?? state.fieldErrors?.password?.[0]

  const submitLogin: SubmitHandler<LoginFormValues> = (_values, event) => {
    const formElement = event?.currentTarget

    if (!(formElement instanceof HTMLFormElement)) {
      return
    }

    startTransition(() => {
      formAction(new FormData(formElement))
    })
  }

  return (
    <Card className="w-full max-w-[400px] rounded-lg border-0 bg-white/95 shadow-xl shadow-slate-200/70 ring-slate-900/10 backdrop-blur">
      <CardHeader className="gap-3 px-6 pt-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-950 text-white shadow-sm">
          <Building2 className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-normal">
            HSS Manager
          </CardTitle>
          <CardDescription>Sign in to continue to your dashboard.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form
          action={formAction}
          className="space-y-5"
          noValidate
          onSubmit={form.handleSubmit(submitLogin)}
        >
          <FieldGroup>
            {state.message ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.message}
              </div>
            ) : null}

            <Field data-invalid={Boolean(usernameError)}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                autoComplete="username"
                aria-invalid={Boolean(usernameError)}
                placeholder="Enter your username"
                disabled={isPending}
                {...form.register("username")}
              />
              <FieldError>{usernameError}</FieldError>
            </Field>

            <Field data-invalid={Boolean(passwordError)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(passwordError)}
                placeholder="Enter your password"
                disabled={isPending}
                {...form.register("password")}
              />
              <FieldError>{passwordError}</FieldError>
            </Field>
          </FieldGroup>

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            <LogIn className="size-4" aria-hidden="true" />
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

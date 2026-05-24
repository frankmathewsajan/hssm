"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { loginAction, type LoginActionState } from "@/actions/auth"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useActionState } from "react"


export function LoginForm() {
  const [state, dispatch] = useActionState(loginAction, { message: "" })
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember_me: false },
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      const formData = new FormData()
      formData.set("username", values.username)
      formData.set("password", values.password)
      if (values.remember_me) formData.set("remember_me", "on") 
      dispatch(formData)
    })
  })

  // Navigate to dashboard on successful login
  useEffect(() => {
    if ((state as LoginActionState)?.ok && !isPending) {
      router.push("/dashboard")
    }
  }, [state, isPending, router])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-semibold text-slate-700 tracking-tight">Username</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-base transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-950/10 focus-visible:border-slate-950"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-semibold text-slate-700 tracking-tight">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 pr-12 text-base transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-950/10 focus-visible:border-slate-950"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember_me"
            render={({ field }) => (
              <FormItem className="flex items-center space-y-0 gap-2.5">
                <FormControl>
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5 rounded-md border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </FormControl>
                <label
                  htmlFor="remember"
                  className="text-sm font-semibold text-slate-600 cursor-pointer select-none tracking-tight"
                >
                  Remember Me
                </label>
              </FormItem>
            )}
          />
          <a href="#" className="text-sm font-bold text-slate-900 hover:underline tracking-tight">
            Forgot Password?
          </a>
        </div>

        <div className="space-y-4">
          {state?.message && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-semibold text-red-600 tracking-tight">
                {state.message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="h-14 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
            disabled={isPending}
          >
            <div className="flex items-center justify-center gap-2.5 font-bold text-base tracking-tight">
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="size-5" />
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </Form>
  )
}
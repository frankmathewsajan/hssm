import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(150, "Username must be 150 characters or fewer"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(256, "Password must be 256 characters or fewer"),
  remember_me: z.boolean().default(false).optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

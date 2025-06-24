import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1),
})

export const templateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean(),
  category: z.string().optional(),
})

// [dev-log-sync]: dcaba7ff1d01ffc4
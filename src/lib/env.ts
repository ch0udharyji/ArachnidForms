import { envSchema } from "./validations"

const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) {
  console.error("❌ Invalid environment variables:", envParsed.error.format())
  throw new Error("Invalid environment variables")
}

export const env = envParsed.data

// [dev-log-sync]: 8005a0a411f688c5
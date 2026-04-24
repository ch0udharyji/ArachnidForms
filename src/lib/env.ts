import { envSchema } from "./validations"

const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) {
  console.error("❌ Invalid environment variables:", envParsed.error.format())
  throw new Error("Invalid environment variables")
}

export const env = envParsed.data

// [dev-log-sync]: 3d2e6cf4013a6680
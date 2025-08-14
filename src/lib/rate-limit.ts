import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// We try to connect to Redis. If env vars are missing, we mock it for development.
const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// Create a new ratelimiter, that allows 100 requests per 60 seconds
export const rateLimit = isRedisConfigured 
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.RATE_LIMIT_REQUESTS || "100"), 
        `${process.env.RATE_LIMIT_WINDOW_SECONDS || "60"} s` as any
      ),
      analytics: true,
    })
  : {
      limit: async () => ({ success: true, limit: 100, remaining: 99, reset: Date.now() + 60000 })
    } // Mock limiter for dev if Redis is not setup

// [dev-log-sync]: e7b31e177a215746
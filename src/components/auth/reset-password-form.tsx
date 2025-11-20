"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      if (!res.ok) throw new Error("Failed to request password reset")
      
      setSuccess(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-surface border border-border rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-12 h-12 text-primary" />
          <p className="text-sm text-muted-foreground">
            If an account exists with <strong>{email}</strong>, a password reset link has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-11 bg-background border-border focus:border-primary transition-colors"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-11 mt-2 text-sm font-medium transition-all" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Sending link..." : "Send Reset Link"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4 opacity-50" />}
          </Button>
        </form>
      )}

      <p className="px-8 text-center text-sm text-muted-foreground mt-8">
        Remember your password?{" "}
        <Link href="/login" className="hover:text-primary underline underline-offset-4 transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  )
}

// [dev-log-sync]: 4d533873917808fe
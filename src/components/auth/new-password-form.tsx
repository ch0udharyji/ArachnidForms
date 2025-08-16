"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

export function NewPasswordForm({ token, email }: { token: string, email: string }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create New Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new secure password for {email}
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-surface border border-border rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-12 h-12 text-primary" />
          <h2 className="text-lg font-medium text-foreground">Password Reset</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link href="/login" className="w-full mt-4">
            <Button className="w-full h-11">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-mono">New Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={8}
              className="h-11 bg-background border-border focus:border-primary transition-colors"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-11 mt-2 text-sm font-medium transition-all" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4 opacity-50" />}
          </Button>
        </form>
      )}
    </div>
  )
}

// [dev-log-sync]: 2927ad472bc8a538
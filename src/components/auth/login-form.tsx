"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"


export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-8 items-center">
        <img src="/logo.png" alt="ArachnidForms Logo" className="w-12 h-12 object-contain mb-2" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Password</Label>
            <Link href="/reset-password" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="h-11 bg-background border-border focus:border-primary transition-colors"
          />
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="w-full h-11 mt-2 text-sm font-medium transition-all" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Logging in..." : "Log in"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
      </form>
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground font-mono uppercase tracking-widest">Or</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button variant="outline" className="h-11 bg-surface border-border hover:bg-muted transition-colors" onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}>
          Continue with Discord
        </Button>
        <Button variant="outline" className="h-11 bg-surface border-border hover:bg-muted transition-colors" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </Button>
        <Link href="/docs" className="w-full">
          <Button variant="outline" className="w-full h-11 bg-surface border-border hover:bg-muted transition-colors">
            Docs & Setup
          </Button>
        </Link>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <Link href="/register" className="hover:text-primary underline underline-offset-4 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  )
}

// [dev-log-sync]: 605ef7a65c2647ac
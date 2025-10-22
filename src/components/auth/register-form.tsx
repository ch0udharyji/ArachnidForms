"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"


export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Simulate API call for registration
    setTimeout(() => {
      setError("Registration endpoint is under construction.")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-8 items-center">
        <img src="/logo.png" alt="ArachnidForms Logo" className="w-12 h-12 object-contain mb-2" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign up to start building your forms
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Full Name</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            className="h-11 bg-background border-border focus:border-primary transition-colors"
          />
        </div>
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
          <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Password</Label>
          <Input 
            id="password" 
            type="password"
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
          {loading ? "Creating account..." : "Sign up"}
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
        Already have an account?{" "}
        <Link href="/login" className="hover:text-primary underline underline-offset-4 transition-colors">
          Log in
        </Link>
      </p>
    </div>
  )
}

// [dev-log-sync]: dff6313cabe15982
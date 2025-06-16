import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground relative font-sans selection:bg-primary/30">
      
      {/* Dynamic Island Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-2xl border border-border/50 rounded-full px-6 h-14 flex items-center justify-between w-[90%] max-w-5xl shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 flex items-center justify-center">
             <Image src="/logo.png" alt="ArachnidForms Logo" width={24} height={24} className="object-contain" />
          </div>
          <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hidden sm:block">
            ArachnidForms
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/register">
            <Button className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold px-5 h-8 text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* 1. Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center relative px-6 z-10 pt-20">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-in fade-in duration-1000 fill-mode-both" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-in fade-in duration-1000 delay-300 fill-mode-both" />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.1] mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
          Form building,<br/>reimagined for the <span className="relative whitespace-nowrap"><span className="absolute -inset-1 rounded-lg bg-primary/20 blur-xl opacity-0 animate-in fade-in duration-1000 delay-700 fill-mode-both" /><span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 italic pr-2">future.</span></span>
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-both">
          Stop building boring forms. Design powerful, logical, and beautiful interactive flows on an infinite canvas that wow your audience.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 ease-out fill-mode-both">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
              Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8 text-base font-bold border-2 border-border/50 hover:bg-surface hover:border-border transition-all duration-300">
              Docs & Setup
            </Button>
          </Link>
        </div>
      </main>

      {/* 2. Footer */}
      <footer className="border-t border-border/50 bg-surface/30 py-6 z-10 relative flex-shrink-0">
        <div className="container mx-auto px-6 max-w-5xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 flex items-center justify-center">
                  <Image src="/logo.png" alt="ArachnidForms Logo" width={24} height={24} className="object-contain" />
               </div>
               <span className="text-lg font-bold tracking-tighter">ArachnidForms</span>
             </div>
             
             <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">

               <Link href="/tos" className="hover:text-foreground transition-colors">Terms of Service</Link>
               <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
               <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
               <Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
               <a href="https://github.com/ch0udharyji" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
             </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground/50 flex flex-col items-center gap-1">
            <p>All right reserves to Shubham Choudhary AKA ch0udharyji on github 2026</p>
            <p>Built with Next.js 14, React Flow, and Shadcn UI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
// [dev-log-sync]: 7009e1b3d3177f1f
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative font-sans selection:bg-primary/30">
      
      {/* Dynamic Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-2xl border border-border/50 rounded-full px-6 h-14 flex items-center justify-between w-[90%] max-w-5xl 2xl:max-w-7xl shadow-2xl transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group w-24">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold hidden sm:block">Back</span>
        </Link>
        
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Terms of Service
          </span>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </header>

      <main className="flex-1 flex flex-col items-center relative px-6 z-10 pt-32 pb-20 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 w-full text-left">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p>Last updated: June 14, 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using ArachnidForms, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily use ArachnidForms for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Disclaimer</h2>
          <p>The materials on ArachnidForms are provided on an 'as is' basis. ArachnidForms makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitations</h2>
          <p>In no event shall ArachnidForms or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use ArachnidForms.</p>
        </div>
      </main>
    </div>
  )
}

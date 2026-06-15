import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
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
            Privacy Policy
          </span>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </header>

      <main className="flex-1 flex flex-col items-center relative px-6 z-10 pt-32 pb-20 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 w-full text-left">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p>Last updated: June 14, 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and form data.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to monitor and analyze trends and usage.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Sharing of Information</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent.</p>
        </div>
      </main>
    </div>
  )
}

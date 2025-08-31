import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Privacy Policy</h1>
        
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
      </div>
    </div>
  )
}

// [dev-log-sync]: 5b22991491df4484
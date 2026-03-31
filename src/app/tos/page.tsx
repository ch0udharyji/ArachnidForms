import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Terms of Service</h1>
        
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
      </div>
    </div>
  )
}

// [dev-log-sync]: 086362c54ab0d442
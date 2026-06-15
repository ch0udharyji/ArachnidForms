import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, ArrowLeft } from 'lucide-react'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Array of contributors
const contributors = [
  {
    name: 'Vinay Vikas Jadhav',
    github: 'https://github.com/V1nayJ',
    contributions: 'feat: add password, address, slider, time, and color form modules',
    avatar: 'https://github.com/V1nayJ.png',
  }
]

export default function Contributions() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground relative font-sans selection:bg-primary/30">
      
      {/* Dynamic Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-2xl border border-border/50 rounded-full px-6 h-14 flex items-center justify-between w-[90%] max-w-5xl 2xl:max-w-7xl shadow-2xl transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group w-24">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold hidden sm:block">Back</span>
        </Link>
        
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Contributions
          </span>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center relative px-6 z-10 pt-32 pb-20 w-full max-w-5xl 2xl:max-w-7xl mx-auto">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] -z-10 overflow-hidden pointer-events-none flex items-center justify-center opacity-50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-in fade-in duration-1000 fill-mode-both" />
        </div>
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary">
            <Heart className="w-8 h-8 fill-primary/20" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            Our Amazing <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 italic pr-2">Contributors</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ArachnidForms is made possible by the incredible community. A huge thank you to everyone who has contributed their time and effort to make this project better!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-both">
          {contributors.map((contributor, index) => (
            <div key={index} className="flex flex-col bg-surface/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-surface/60 hover:border-border transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={contributor.avatar} alt={contributor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{contributor.name}</h3>
                  <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <GithubIcon className="w-4 h-4 mr-1" />
                    @{contributor.github.split('/').pop()}
                  </a>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground/80 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1.5 text-primary" />
                  What they added
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {contributor.contributions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/30 py-6 z-10 relative flex-shrink-0 mt-auto">
        <div className="container mx-auto px-6 max-w-5xl 2xl:max-w-7xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <div className="flex items-center gap-2">
               <Link href="/" className="flex items-center gap-2">
                 <div className="w-6 h-6 flex items-center justify-center">
                    <Image src="/logo.png" alt="ArachnidForms Logo" width={24} height={24} className="object-contain" />
                 </div>
                 <span className="text-lg font-bold tracking-tighter">ArachnidForms</span>
               </Link>
             </div>
             
             <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
               <Link href="/contributions" className="text-primary transition-colors">Contributions</Link>
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

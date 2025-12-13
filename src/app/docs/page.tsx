import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Code, Terminal, Database, Server } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Documentation & Setup | ArachnidForms",
  description: "Learn how to deploy your own version of ArachnidForms.",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Documentation & Setup</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know to run your own instance of ArachnidForms.
          </p>
        </header>

        {/* Showcase Notice */}
        <section className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-primary/20 p-3 rounded-full flex-shrink-0">
            <Server className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Showcase & Testing Only</h2>
            <p className="text-muted-foreground leading-relaxed">
              This hosted version of ArachnidForms is strictly a <strong>showcase and testing environment</strong>. 
              The database is routinely cleared, and it is not intended for production use or collecting sensitive real-world data. 
              If you love the platform and want to use it for your own projects, you are highly encouraged to fork the repository and host it on your own infrastructure!
            </p>
            <div className="mt-4">
              <a href="https://github.com/ch0udharyji/AnachnidForms" target="_blank" rel="noopener noreferrer">
                <Button className="font-bold">
                  <Code className="w-4 h-4 mr-2" /> View Repository
                </Button>
              </a>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {/* Step 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Terminal className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">1. Prerequisites & Cloning</h2>
            </div>
            <p className="text-muted-foreground">Before you begin, make sure you have <strong>Node.js 18+</strong> and <strong>PostgreSQL</strong> installed on your system.</p>
            <div className="bg-card border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code>
                git clone https://github.com/ch0udharyji/AnachnidForms.git<br/>
                cd AnachnidForms<br/>
                npm install
              </code>
            </div>
          </section>

          {/* Step 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">2. Environment Configuration</h2>
            </div>
            <p className="text-muted-foreground">
              Create a <code>.env</code> file in the root of your project. You will need to provide your database credentials and authentication secrets.
            </p>
            <div className="bg-card border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto text-muted-foreground">
              <pre><code>{`DATABASE_URL="postgresql://user:password@localhost:5432/arachnidforms?schema=public"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret-here"

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@arachnidforms.com"

UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

RATE_LIMIT_REQUESTS="100"
RATE_LIMIT_WINDOW_SECONDS="60"

S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_REGION=""
S3_BUCKET_NAME=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"`}</code></pre>
            </div>
          </section>

          {/* Step 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">3. Database Initialization</h2>
            </div>
            <p className="text-muted-foreground">
              ArachnidForms uses Prisma as its ORM. Once your <code>DATABASE_URL</code> is set, push the schema to your database to create the required tables.
            </p>
            <div className="bg-card border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code>
                npx prisma generate<br/>
                npx prisma db push
              </code>
            </div>
          </section>

          {/* Step 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-2">
              <Server className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">4. Start the Development Server</h2>
            </div>
            <p className="text-muted-foreground">
              You are now ready to run the application locally! Start the Turbopack dev server.
            </p>
            <div className="bg-card border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code>npm run dev</code>
            </div>
            <p className="text-muted-foreground mt-4">
              Open <strong>http://localhost:3000</strong> in your browser to see your instance live.
            </p>
          </section>

          {/* Deployment */}
          <section className="space-y-4 pt-6">
            <h2 className="text-2xl font-bold">Deploying to Production</h2>
            <p className="text-muted-foreground leading-relaxed">
              For production deployment, we highly recommend <a href="https://vercel.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Vercel</a>. 
              Simply push your code to a GitHub repository, link it to a new Vercel project, and add your Environment Variables in the Vercel dashboard. 
              Vercel will automatically detect that it's a Next.js App Router application and handle the build process (<code>npm run build</code>) for you.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

// [dev-log-sync]: 840a9d5f56e48de9
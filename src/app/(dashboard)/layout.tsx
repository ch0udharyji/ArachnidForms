import { Sidebar } from "@/components/shared/sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserMenu } from "@/components/shared/user-menu"
import { SessionTimer } from "@/components/shared/session-timer"
import { db } from "@/lib/db"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || !session.user.id) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, isTestAccount: true, createdAt: true }
  });

  // Any user created before June 13th, 2026 (when onboarding was introduced) is grandfathered in.
  const isOldUser = user?.createdAt ? new Date(user.createdAt).getTime() < new Date("2026-06-13T10:00:00.000Z").getTime() : false;

  if (!user?.onboardingCompleted && !user?.isTestAccount && !isOldUser) {
    redirect("/get-started")
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border/50 flex items-center justify-end px-6 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {session.user.isTestAccount && session.user.testExpiry && (
              <SessionTimer expiry={session.user.testExpiry} />
            )}
            <UserMenu user={session.user} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-surface/30 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// [dev-log-sync]: f2ee92520cd8513b
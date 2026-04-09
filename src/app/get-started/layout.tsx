import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export default async function GetStartedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true }
  });

  if (user?.onboardingCompleted) {
    redirect("/dashboard")
  }

  return <>{children}</>
}

// [dev-log-sync]: b9d45ffd149b9378
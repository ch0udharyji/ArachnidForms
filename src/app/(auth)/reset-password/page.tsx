import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default async function ResetPasswordPage() {
  const session = await auth()
  if (session?.user?.id) {
    redirect("/dashboard")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ResetPasswordForm />
    </div>
  )
}

// [dev-log-sync]: 9b3366b4d0e58c2a
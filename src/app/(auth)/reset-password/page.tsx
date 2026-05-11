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

// [dev-log-sync]: 4898ecdab1c2aad7
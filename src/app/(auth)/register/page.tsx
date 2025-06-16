import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"

export default async function RegisterPage() {
  const session = await auth()
  if (session?.user?.id) {
    redirect("/dashboard")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RegisterForm />
    </div>
  )
}

// [dev-log-sync]: c8807c1ba93adba8
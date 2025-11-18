import { db } from "@/lib/db"
import { NewPasswordForm } from "@/components/auth/new-password-form"
import Link from "next/link"

export default async function NewPasswordPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const tokenRecord = await db.verificationToken.findUnique({
    where: { token: params.token }
  })

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold mb-2">Invalid or Expired Link</h1>
          <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
          <Link href="/reset-password" className="text-primary hover:underline block mt-4">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <NewPasswordForm token={params.token} email={tokenRecord.identifier} />
    </div>
  )
}

// [dev-log-sync]: 757bf357f1b9567c
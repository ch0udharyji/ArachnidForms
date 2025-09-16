import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "./settings-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - ArachnidForms",
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, isTestAccount: true, role: true }
  })

  if (!user) redirect("/login")

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black tracking-tight mb-8">General Settings</h1>
      <SettingsForm user={user} />
    </div>
  )
}

// [dev-log-sync]: 0429764d08894622
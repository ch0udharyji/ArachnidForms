import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { IntegrationSettings } from "./integration-settings"

export default async function ApiKeysPage() {
  const session = await auth()
  if (!session?.user || !session.user.id) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { integrations: true, isTestAccount: true }
  })

  const envStatus = {
    hasSmtp: !!process.env.EMAIL_SERVER_HOST,
    hasS3: !!process.env.S3_BUCKET_NAME
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Keys & Integrations</h1>
      <IntegrationSettings initialIntegrations={user?.integrations || {}} isTestAccount={user?.isTestAccount} envStatus={envStatus} />
    </div>
  )
}

// [dev-log-sync]: 7d96a0e0aa5563c5
import { BuilderCanvas } from "@/components/canvas/builder-canvas"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MonitorSmartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

import { db } from "@/lib/db"

export default async function BuilderPage(props: { params: Promise<{ id: string }> }) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { integrations: true }
  });

  const integrations = (user?.integrations as any) || {};
  const hasStripe = !!integrations.stripe;
  const hasS3 = !!process.env.S3_BUCKET_NAME || (!!integrations.s3_access && !!integrations.s3_secret && !!integrations.s3_bucket);

  const params = await props.params;
  
  const form = await db.form.findUnique({
    where: { id: params.id, ownerId: session.user.id },
    select: { slug: true, canvasData: true }
  });

  if (!form) redirect("/dashboard");

  return (
    <>
      <div className="h-screen w-screen flex flex-col bg-background lg:hidden items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <MonitorSmartphone className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Display Too Small</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">The form builder requires a larger display to properly arrange and edit nodes. Please use a device with a higher resolution or switch to a desktop screen.</p>
        <Link href="/dashboard">
          <Button variant="default">Return to Dashboard</Button>
        </Link>
      </div>
      <div className="hidden lg:flex h-screen w-screen flex-col bg-background">
        <BuilderCanvas 
          formId={params.id} 
          formSlug={form.slug} 
          initialData={form.canvasData} 
          integrations={{ hasStripe, hasS3 }} 
          isTestAccount={session.user.isTestAccount}
        />
      </div>
    </>
  )
}

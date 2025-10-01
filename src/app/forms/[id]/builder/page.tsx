import { BuilderCanvas } from "@/components/canvas/builder-canvas"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

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
    <div className="h-screen w-screen flex flex-col bg-background">
      <BuilderCanvas formId={params.id} formSlug={form.slug} initialData={form.canvasData} integrations={{ hasStripe, hasS3 }} />
    </div>
  )
}

// [dev-log-sync]: 94df27373022175a
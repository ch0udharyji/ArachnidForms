import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import GetStartedWizard from "./get-started-wizard";

export default async function GetStartedPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  if (session.user.isTestAccount) {
    redirect("/dashboard");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, createdAt: true }
  });

  const isOldUser = user?.createdAt ? new Date(user.createdAt).getTime() < new Date("2026-06-13T10:00:00.000Z").getTime() : false;

  if (user?.onboardingCompleted || isOldUser) {
    redirect("/dashboard");
  }

  const envStatus = {
    hasSmtp: !!process.env.EMAIL_SERVER_HOST,
    hasS3: !!process.env.S3_BUCKET_NAME
  };

  return <GetStartedWizard envStatus={envStatus} />;
}

// [dev-log-sync]: 899c42ead2d168e8
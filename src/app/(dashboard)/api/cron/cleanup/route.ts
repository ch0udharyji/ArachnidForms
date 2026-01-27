import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  // Use a secret token to protect this route if it was triggered via cron
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  try {
    const deletedUsers = await db.user.deleteMany({
      where: {
        isTestAccount: true,
        createdAt: {
          lt: oneHourAgo
        }
      }
    });

    const deletedForms = await db.form.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({ success: true, deletedUsers: deletedUsers.count, deletedForms: deletedForms.count })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cleanup" }, { status: 500 })
  }
}

// [dev-log-sync]: 9b02eaf293f27373
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { integrations } = body;

    await db.user.update({
      where: { id: session.user.id },
      data: {
        integrations: integrations || {},
        onboardingCompleted: true,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// [dev-log-sync]: 25227477688b5d49
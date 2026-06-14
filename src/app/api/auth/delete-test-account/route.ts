import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();
    if (session?.user?.id && session.user.isTestAccount) {
      await db.user.delete({ where: { id: session.user.id } });
      return NextResponse.json({ success: true, deleted: true });
    }
    return NextResponse.json({ success: true, deleted: false });
  } catch (error) {
    console.error("Failed to delete test account", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

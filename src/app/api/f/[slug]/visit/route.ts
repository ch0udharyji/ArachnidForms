import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;

    await db.form.update({
      where: { slug: params.slug },
      data: { visits: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// [dev-log-sync]: 848a5509875bf1bd
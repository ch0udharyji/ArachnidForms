import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { internalNotes } = body;

    // Verify ownership
    const response = await db.formResponse.findUnique({
      where: { id },
      include: { form: true }
    });

    if (!response || response.form.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.formResponse.update({
      where: { id },
      data: { internalNotes }
    });

    return NextResponse.json({ success: true, internalNotes: updated.internalNotes });
  } catch (error) {
    console.error("Failed to update notes", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

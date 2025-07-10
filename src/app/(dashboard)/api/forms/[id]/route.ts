import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await request.json();
    const { nodes, edges, expiresAt, status, title, description, maxResponses } = body;

    const form = await db.form.findUnique({
      where: { id }
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (nodes && edges) {
      updateData.canvasData = { nodes, edges };
    }
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (maxResponses !== undefined) {
      updateData.maxResponses = maxResponses ? parseInt(maxResponses, 10) : null;
    }

    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }
    
    if (status) {
      updateData.status = status;
    }

    const updatedForm = await db.form.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("[FORM_SAVE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// [dev-log-sync]: eaddb5990c719857
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { answers } = body;

    const form = await db.form.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "published") {
      return NextResponse.json({ error: "Form is not currently accepting responses" }, { status: 403 });
    }

    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This form has expired" }, { status: 403 });
    }

    if (form.maxResponses && form._count.responses >= form.maxResponses) {
      return NextResponse.json({ error: "This form has reached its maximum number of responses" }, { status: 403 });
    }

    // Record response
    await db.formResponse.create({
      data: {
        formId: form.id,
        answers: answers || {},
      }
    });

    // Update visits/traffic on successful submission (optional, or tracked separately. Let's just track it here for simplicity if not done via page load)
    await db.form.update({
      where: { id: form.id },
      data: { visits: { increment: 1 } } // We increment visits when the form is viewed, but doing it here ensures at least 1 visit per response. Ideally we increment on page load.
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// [dev-log-sync]: 742005e2ce239d7b
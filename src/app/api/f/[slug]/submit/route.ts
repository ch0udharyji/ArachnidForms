import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to submit this form" }, { status: 401 });
    }
    
    if (session.user.isTestAccount) {
      return NextResponse.json({ error: "Test accounts are not allowed to submit forms. Please sign up with a real account." }, { status: 403 });
    }

    const params = await props.params;
    const body = await req.json();
    const { answers, answersById, responseId, captchaToken } = body;

    const form = await db.form.findUnique({
      where: { slug: params.slug },
      include: {
        _count: {
          select: { responses: true }
        },
        owner: true
      }
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const ownerIntegrations = (form.owner?.integrations as any) || {};
    const secretKey = ownerIntegrations.recaptcha_secret || process.env.RECAPTCHA_SECRET_KEY;
    
    if (secretKey) {
      if (!captchaToken) {
        return NextResponse.json({ error: "Please complete the reCAPTCHA to submit." }, { status: 400 });
      }

      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${captchaToken}`,
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
      }
      
      // v3 specific: check score
      if (verifyData.score !== undefined && verifyData.score < 0.5) {
        return NextResponse.json({ error: "Automated behavior detected. Please try again later." }, { status: 403 });
      }
    }

    if (form.status !== "published") {
      return NextResponse.json({ error: "Form is not currently accepting responses" }, { status: 403 });
    }

    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This form has expired" }, { status: 403 });
    }

    const settings = (form.canvasData as any)?.settings || {};

    // Backend Validation
    const nodes = (form.canvasData as any)?.nodes || [];
    const questionNodes = nodes.filter((n: any) => n.type === 'questionNode');
    
    for (const node of questionNodes) {
      const qType = node.data?.questionType;
      const isRequired = node.data?.required;
      const val = answersById[node.id];
      const label = node.data?.label || 'Untitled Question';

      if (isRequired && (val === undefined || val === null || val === '')) {
        return NextResponse.json({ error: `Field "${label}" is required.` }, { status: 400 });
      }

      if (val !== undefined && val !== null && val !== '') {
        switch (qType) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
              return NextResponse.json({ error: `Field "${label}" must be a valid email.` }, { status: 400 });
            }
            break;
          case 'number':
          case 'slider':
          case 'rating':
          case 'nps':
            if (isNaN(Number(val))) {
              return NextResponse.json({ error: `Field "${label}" must be a number.` }, { status: 400 });
            }
            break;
          case 'url':
            try {
              new URL(String(val));
            } catch (_) {
              return NextResponse.json({ error: `Field "${label}" must be a valid URL.` }, { status: 400 });
            }
            break;
          case 'consent':
            if (isRequired && val !== true && String(val) !== 'true') {
              return NextResponse.json({ error: `You must agree to "${label}".` }, { status: 400 });
            }
            break;
          case 'select':
          case 'radio':
          case 'dropdown':
          case 'multiple_choice':
            const options = node.data?.options || [];
            if (options.length > 0 && !options.includes(String(val))) {
              return NextResponse.json({ error: `Invalid option selected for "${label}".` }, { status: 400 });
            }
            break;
        }
      }
    }

    if (responseId) {
      // Handle Update
      if (!settings.allowEdit) {
        return NextResponse.json({ error: "Editing responses is not allowed for this form" }, { status: 403 });
      }

      const existingResponse = await db.formResponse.findUnique({ where: { id: responseId } });
      if (!existingResponse || existingResponse.formId !== form.id || existingResponse.respondentId !== session?.user?.id) {
        return NextResponse.json({ error: "Response not found or unauthorized" }, { status: 403 });
      }

      const meta = (existingResponse.metadata as any) || {};
      const editCount = (meta.editCount || 0) + 1;

      if (settings.maxEdits && editCount > settings.maxEdits) {
        return NextResponse.json({ error: "Maximum edit attempts reached" }, { status: 403 });
      }

      await db.formResponse.update({
        where: { id: responseId },
        data: {
          answers: answers || {},
          metadata: { ...meta, answersById: answersById || {}, editCount }
        }
      });
    } else {
      // Handle Create
      if (form.maxResponses && form._count.responses >= form.maxResponses) {
        return NextResponse.json({ error: "This form has reached its maximum number of responses" }, { status: 403 });
      }

      await db.formResponse.create({
        data: {
          formId: form.id,
          respondentId: session?.user?.id || null,
          answers: answers || {},
          metadata: { answersById: answersById || {}, editCount: 0 }
        }
      });
    }

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

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicFormClient } from "./public-form-client";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const form = await db.form.findUnique({
    where: { slug: params.slug },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anachnidforms.vercel.app";

  if (!form) {
    return {
      title: "Form Not Found | ArachnidForms",
      description: "The form you are looking for does not exist or has been removed."
    };
  }

  const title = form.title || "Untitled Form";
  const description = form.description || "Fill out this form created with ArachnidForms.";
  const ogImageUrl = `${appUrl}/api/f/${params.slug}/og`;
  const formUrl = `${appUrl}/f/${params.slug}`;

  return {
    title: `${title} | ArachnidForms`,
    description: description,
    alternates: {
      canonical: formUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: formUrl,
      type: "website",
      siteName: "ArachnidForms",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Cover Image`,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
      creator: "@arachnidforms",
    }
  };
}

import { auth } from "@/lib/auth";

export default async function PublicFormRenderer(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const session = await auth();
  const form = await db.form.findUnique({
    where: { slug: params.slug },
    include: { owner: true }
  });

  if (!form) {
    notFound();
  }

  // Treat missing canvasData as empty
  const canvasData = form.canvasData && typeof form.canvasData === 'object' 
    ? form.canvasData 
    : { nodes: [], edges: [] };

  const settings = (canvasData as any).settings || {};
  let previousResponse = null;

  if (session?.user?.id && settings.allowEdit) {
    const existingResponse = await db.formResponse.findFirst({
      where: { formId: form.id, respondentId: session.user.id },
      orderBy: { submittedAt: 'desc' }
    });
    if (existingResponse) {
      const metadata = (existingResponse.metadata as any) || {};
      const editCount = metadata.editCount || 0;
      if (!settings.maxEdits || editCount < settings.maxEdits) {
        // Serialize the response because we are passing it to a Client Component
        previousResponse = {
          id: existingResponse.id,
          answers: existingResponse.answers,
          answersById: metadata.answersById || {},
          editCount: editCount
        };
      }
    }
  }

  const ownerIntegrations = (form.owner?.integrations as any) || {};
  const recaptchaSite = ownerIntegrations.recaptcha_site || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <PublicFormClient 
      slug={params.slug} 
      title={form.title} 
      canvasData={canvasData} 
      session={session}
      previousResponse={previousResponse}
      recaptchaSite={recaptchaSite}
    />
  );
}

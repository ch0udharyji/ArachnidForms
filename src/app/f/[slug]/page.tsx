import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicFormClient } from "./public-form-client";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const form = await db.form.findUnique({
    where: { slug: params.slug },
  });

  if (!form) {
    return {
      title: "Form Not Found | ArachnidForms",
      description: "The form you are looking for does not exist or has been removed."
    };
  }

  return {
    title: `${form.title} | ArachnidForms`,
    description: form.description || "Please fill out this form.",
    openGraph: {
      title: form.title,
      description: form.description || "Please fill out this form.",
      type: "website",
      siteName: "ArachnidForms",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: "ArachnidForms Logo",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: form.title,
      description: form.description || "Please fill out this form.",
      images: ["/logo.png"],
    }
  };
}

export default async function PublicFormRenderer(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const form = await db.form.findUnique({
    where: { slug: params.slug },
  });

  if (!form) {
    notFound();
  }

  // Treat missing canvasData as empty
  const canvasData = form.canvasData && typeof form.canvasData === 'object' 
    ? form.canvasData 
    : { nodes: [], edges: [] };

  return (
    <PublicFormClient 
      slug={params.slug} 
      title={form.title} 
      canvasData={canvasData} 
    />
  );
}

// [dev-log-sync]: 07474b7680404731
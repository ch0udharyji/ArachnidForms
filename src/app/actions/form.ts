"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTemplateData } from "@/lib/templates-data";

export async function createFormAction(titleOrFormData?: FormData | string, descriptionInput?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const slug = randomBytes(8).toString("hex");

  let title = "Untitled Form";
  let description = "";

  if (typeof titleOrFormData === "string") {
    title = titleOrFormData;
    if (descriptionInput) description = descriptionInput;
  }

  let canvasData: any = { elements: [] };
  if (title !== "Untitled Form") {
    // Looks like it was created from a template
    canvasData = getTemplateData(title);
  } else {
    // Create empty starting point
    canvasData = {
      nodes: [
        { id: 'start', type: 'startNode', position: { x: 300, y: 50 }, data: { label: 'Start' }, deletable: false },
        { id: 'end', type: 'endNode', position: { x: 300, y: 500 }, data: { label: 'Submit' }, deletable: false },
      ],
      edges: []
    }
  }

  const form = await db.form.create({
    data: {
      ownerId: session.user.id,
      title,
      description,
      slug,
      canvasData,
      status: "draft",
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/forms");
  redirect(`/forms/${form.id}/builder`);
}

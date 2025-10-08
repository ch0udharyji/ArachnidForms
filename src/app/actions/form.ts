"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";

function generateTemplateData(title: string) {
  const isHR = title.includes("Application") || title.includes("Employee") || title.includes("Interview") || title.includes("Time Off") || title.includes("Evaluation");
  const isEvent = title.includes("RSVP") || title.includes("Registration") || title.includes("Sign-up");
  const isFeedback = title.includes("Feedback") || title.includes("Satisfaction") || title.includes("Review") || title.includes("Score") || title.includes("Survey");
  const isHealth = title.includes("Patient") || title.includes("Symptom") || title.includes("Appointment") || title.includes("Followup");
  const isEcom = title.includes("Order") || title.includes("Wholesale");

  const startNode = { id: 'start', type: 'startNode', position: { x: 300, y: 50 }, data: { label: 'Start' }, deletable: false };
  const endNode = { id: 'end', type: 'endNode', position: { x: 300, y: 650 }, data: { label: 'Submit' }, deletable: false };

  const getId = () => `node_${Math.random().toString(36).substring(2, 9)}`;
  const q1Id = getId();
  const q2Id = getId();
  const q3Id = getId();

  let q1, q2, q3;

  if (isFeedback) {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: `How satisfied are you with ${title.replace(" Satisfaction", "")}?`, questionType: 'rating', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'What could we improve?', questionType: 'textarea', required: false } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Would you recommend us?', questionType: 'radio', required: true, options: ['Yes', 'No'] } };
  } else if (isEvent) {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: 'Full Name', questionType: 'text', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'Email Address', questionType: 'email', required: true } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Will you be attending?', questionType: 'radio', required: true, options: ['Yes', 'No'] } };
  } else if (isHR) {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: 'Full Name', questionType: 'text', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'Department', questionType: 'select', required: true, options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Other'] } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Please provide your details', questionType: 'textarea', required: true } };
  } else if (isHealth) {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: 'Patient Name', questionType: 'text', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'Date of Birth', questionType: 'date', required: true } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Primary Reason for Visit', questionType: 'textarea', required: true } };
  } else if (isEcom) {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: 'Order Number', questionType: 'text', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'Email Address', questionType: 'email', required: true } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Additional details', questionType: 'textarea', required: false } };
  } else {
    q1 = { id: q1Id, type: 'questionNode', position: { x: 300, y: 200 }, data: { label: 'What is your name?', questionType: 'text', required: true } };
    q2 = { id: q2Id, type: 'questionNode', position: { x: 300, y: 350 }, data: { label: 'What is your email?', questionType: 'email', required: true } };
    q3 = { id: q3Id, type: 'questionNode', position: { x: 300, y: 500 }, data: { label: 'Please provide more details regarding your inquiry.', questionType: 'textarea', required: false } };
  }

  const nodes = [startNode, q1, q2, q3, endNode];
  const edges = [
    { id: `edge_${getId()}`, source: 'start', target: q1.id },
    { id: `edge_${getId()}`, source: q1.id, target: q2.id },
    { id: `edge_${getId()}`, source: q2.id, target: q3.id },
    { id: `edge_${getId()}`, source: q3.id, target: 'end' },
  ];

  return { nodes, edges };
}

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
    canvasData = generateTemplateData(title);
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

// [dev-log-sync]: 3f1892fc2490bb45
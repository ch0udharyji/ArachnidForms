import { randomBytes } from "crypto";

const getId = () => `node_${randomBytes(4).toString("hex")}`;

export function getTemplateData(title: string) {
  const startNode = { id: 'start', type: 'startNode', position: { x: 300, y: 50 }, data: { label: 'Start' }, deletable: false };
  let endY = 200;
  
  const nodes: any[] = [startNode];
  const edges: any[] = [];
  
  const addQuestion = (label: string, type: string, required: boolean, options?: string[]) => {
    const id = getId();
    nodes.push({
      id,
      type: 'questionNode',
      position: { x: 300, y: endY },
      data: { label, questionType: type, required, options }
    });
    endY += 150;
    return id;
  };

  // High-quality templates based on title
  if (title === "Customer Satisfaction") {
    addQuestion("How would you rate your overall satisfaction?", "rating", true);
    addQuestion("How likely are you to recommend us to a friend or colleague?", "nps", true);
    addQuestion("What did you like most about your experience?", "textarea", false);
    addQuestion("How could we improve?", "textarea", false);
  } else if (title === "Product Review") {
    addQuestion("Which product did you purchase?", "text", true);
    addQuestion("How would you rate the product quality?", "rating", true);
    addQuestion("Please describe your experience using the product", "textarea", true);
    addQuestion("Would you buy this product again?", "radio", true, ["Yes", "No", "Maybe"]);
  } else if (title === "Job Application") {
    addQuestion("Full Name", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Phone Number", "number", true);
    addQuestion("LinkedIn Profile URL", "url", false);
    addQuestion("Please upload your Resume/CV", "file", true);
    addQuestion("Cover Letter (Optional)", "textarea", false);
  } else if (title === "Time Off Request") {
    addQuestion("Employee Name", "text", true);
    addQuestion("Department", "select", true, ["Engineering", "Sales", "Marketing", "HR", "Operations", "Other"]);
    addQuestion("Start Date of Leave", "date", true);
    addQuestion("End Date of Leave", "date", true);
    addQuestion("Reason for Time Off", "textarea", true);
  } else if (title === "Meetup RSVP" || title === "Conference Registration") {
    addQuestion("Full Name", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Will you be attending?", "radio", true, ["Yes, I'll be there", "No, I can't make it"]);
    addQuestion("Do you have any dietary restrictions?", "checkbox", false, ["Vegetarian", "Vegan", "Gluten-Free", "Nut Allergy", "None"]);
  } else if (title === "Lead Generation" || title === "Content Download") {
    addQuestion("First Name", "text", true);
    addQuestion("Last Name", "text", true);
    addQuestion("Work Email", "email", true);
    addQuestion("Company Name", "text", true);
    addQuestion("Job Title", "text", false);
    addQuestion("What are your main challenges right now?", "textarea", false);
  } else if (title === "Patient Intake") {
    addQuestion("Full Patient Name", "text", true);
    addQuestion("Date of Birth", "date", true);
    addQuestion("Phone Number", "number", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Residential Address", "address", true);
    addQuestion("Primary Reason for Visit", "textarea", true);
    addQuestion("Current Medications (if any)", "textarea", false);
    addQuestion("Medical History", "checkbox", false, ["Diabetes", "Hypertension", "Asthma", "Heart Condition", "None"]);
    addQuestion("Consent for treatment", "consent", true);
    addQuestion("Patient Signature", "signature", true);
  } else if (title === "Helpdesk Ticket" || title === "Bug Report") {
    addQuestion("Reported By", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Issue Category", "select", true, ["Hardware", "Software", "Network", "Access/Permissions", "Other"]);
    addQuestion("Urgency", "radio", true, ["Low", "Medium", "High", "Critical"]);
    addQuestion("Please describe the issue in detail", "textarea", true);
    addQuestion("Upload any relevant screenshots", "file", false);
  } else if (title === "Order Return") {
    addQuestion("Order Number", "text", true);
    addQuestion("Customer Email", "email", true);
    addQuestion("Reason for Return", "select", true, ["Wrong item received", "Item defective", "Changed my mind", "Arrived too late", "Other"]);
    addQuestion("Please provide more details", "textarea", false);
    addQuestion("Upload photo of the item (if defective)", "file", false);
  } else if (title === "Property Viewing") {
    addQuestion("Full Name", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Phone Number", "number", true);
    addQuestion("Which property are you interested in?", "text", true);
    addQuestion("Preferred Viewing Date", "date", true);
    addQuestion("Preferred Viewing Time", "time", true);
  } 
  // Category fallbacks
  else if (title.includes("Feedback") || title.includes("Satisfaction") || title.includes("Review") || title.includes("Survey")) {
    addQuestion("How satisfied are you with our service?", "rating", true);
    addQuestion("What could we improve?", "textarea", false);
    addQuestion("Would you recommend us?", "nps", true);
  } else if (title.includes("Registration") || title.includes("RSVP") || title.includes("Sign-up") || title.includes("Event")) {
    addQuestion("Full Name", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Will you be attending?", "radio", true, ["Yes", "No"]);
  } else if (title.includes("Application") || title.includes("HR") || title.includes("Employee")) {
    addQuestion("Full Name", "text", true);
    addQuestion("Email Address", "email", true);
    addQuestion("Department/Role", "text", true);
    addQuestion("Please provide details", "textarea", true);
  } else if (title.includes("Health") || title.includes("Patient") || title.includes("Medical")) {
    addQuestion("Patient Name", "text", true);
    addQuestion("Date of Birth", "date", true);
    addQuestion("Reason for Inquiry", "textarea", true);
  } else {
    // Generic fallback
    addQuestion("What is your name?", "text", true);
    addQuestion("What is your email?", "email", true);
    addQuestion("Please provide more details.", "textarea", false);
  }

  // Add end node
  const endNode = { id: 'end', type: 'endNode', position: { x: 300, y: endY }, data: { label: 'Submit' }, deletable: false };
  nodes.push(endNode);

  // Link nodes sequentially
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: \`edge_\${getId()}\`,
      source: nodes[i].id,
      target: nodes[i+1].id
    });
  }

  return { nodes, edges };
}

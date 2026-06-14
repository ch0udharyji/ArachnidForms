<div align="center">
  <img src="header.png" alt="ArachnidForms Logo" width="800" />

  <h1>ArachnidForms</h1>

  <p>
    <b>A modern, high-performance form builder built on the Next.js App Router.</b>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge&color=000000&labelColor=222222" alt="Version" />
    <img src="https://img.shields.io/badge/Next.js-14.0+-black?style=for-the-badge&logo=next.js&color=000000&labelColor=222222" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript&color=000000&labelColor=222222" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&color=000000&labelColor=222222" alt="License" />
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-documentation">Documentation</a>
  </p>
</div>

<br/>

## ❖ Overview

ArachnidForms is designed for creators, businesses, and developers who need complex forms without the hassle. It features a powerful drag-and-drop node-based builder, real-time conditional logic, and a beautifully interactive respondent experience.

---

## ❖ Features

▸ **Visual Node Builder**  
Build your forms using a completely free-form infinite canvas. Connect questions with edges just like a flowchart.

▸ **Smart Logic Branching**  
Use Logic Nodes to dynamically skip or route users to different questions based on their previous answers.

▸ **Sleek Viewer Experience**  
Respondents get a focused, one-question-at-a-time experience with full keyboard navigation support.

▸ **Template Gallery**  
Jumpstart your workflow with dozens of intelligent templates that auto-generate fully connected, ready-to-use form flows.

▸ **Visual Analytics Dashboard**  
Automatically generated Pie Charts and Bar Charts for multiple-choice and rating questions.

▸ **Export Capabilities**  
Export all your form responses with a single click securely to your local device via CSV.

---

## ❖ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Core** | `Next.js 14` | React framework using the App Router |
| **Language** | `TypeScript` | Strongly typed programming language |
| **Database** | `PostgreSQL` | Relational database system |
| **ORM** | `Prisma` | Next-generation Node.js and TypeScript ORM |
| **Authentication**| `Auth.js` | Complete open source authentication |
| **Styling** | `Tailwind CSS` | Utility-first CSS framework |
| **Components** | `Shadcn UI` | Beautifully designed, accessible UI components |
| **Canvas** | `React Flow` | Highly customizable node-based UI |
| **Charts** | `Recharts` | Composable charting library built on React |

---

## ❖ Getting Started

### 1. Prerequisites

Ensure you have the following installed on your local machine:
◆ **Node.js** (v18.17 or higher)
◆ **npm** or **yarn**

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update your `.env` with your PostgreSQL database URL, Auth.js secret, and any required OAuth credentials.

### 4. Database Setup

Generate the Prisma client and push your schema to the database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Running Locally

Start the local development server:

```bash
npm run dev
```

Navigate to `https://anachnidforms.vercel.app` (or your configured `AUTH_URL`) in your browser to see the application running.

---

## ❖ Documentation

Detailed documentation on extending ArachnidForms, creating custom nodes, and managing API keys can be found inside the application dashboard under the **Docs & Setup** section.

◆ **Form Nodes**: Understand the schema structure required for adding new node types.
◆ **Webhooks**: Configure endpoints to receive real-time payload submissions.
◆ **Analytics**: Export data structure details and chart implementations.

---

<div align="center">
  <p>Built with precision and high performance in mind.</p>
</div>

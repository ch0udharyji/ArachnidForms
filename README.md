<div align="center">
  <img src="./public/header.png" alt="ArachnidForms Logo" width="800" />

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

Ensure you have the following tools installed on your local machine:
◆ **Node.js** (v18.17 or higher)
◆ **npm** (v9+ recommended) or **yarn**
◆ **Git**
◆ **PostgreSQL** (Local installation or a remote instance like Supabase/Neon)

### 2. Repository Setup

Clone the repository to your local machine and navigate into the project directory:

```bash
git clone https://github.com/your-username/arachnidforms.git
cd arachnidforms
```

Install the required Node dependencies:

```bash
npm install
```

### 3. Environment Configuration

The application requires several environment variables to function correctly. Start by duplicating the provided example file:

```bash
cp .env.example .env
```

Open `.env` in your preferred text editor and configure the core variables:

◆ **DATABASE_URL**: Your PostgreSQL connection string. If using a connection pooler like Supabase PgBouncer, ensure you append `?pgbouncer=true`.
◆ **AUTH_SECRET**: A secure 32-character string required by NextAuth (Auth.js) to encrypt sessions. You can easily generate one via your terminal:
```bash
openssl rand -base64 32
```
◆ **OAuth Providers (Optional)**: If you intend to use Google or Discord logins, provide their respective `CLIENT_ID` and `CLIENT_SECRET` values. Without these, you can still securely log in using the "Test Mode" option.

### 4. Database Initialization

With your `DATABASE_URL` configured, initialize the Prisma ORM. 

First, generate the strictly-typed TypeScript client so Next.js can communicate with your database:

```bash
npx prisma generate
```

Next, push the database schema to your PostgreSQL instance to create all the necessary tables:

```bash
npx prisma db push
```

### 5. Launch Development Server

You are now ready to boot up the local development environment:

```bash
npm run dev
```

The server will start on port `3000`. Navigate to `http://localhost:3000` (or your configured `AUTH_URL`) in your web browser. 

### 6. Accessing the Dashboard

When the app loads, click the login/signup button. 
If you haven't configured Google or Discord, simply click the **"Go in test mode"** button. This will automatically provision a temporary test account and route you straight to the builder dashboard, allowing you to seamlessly bypass OAuth setup during initial testing!

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

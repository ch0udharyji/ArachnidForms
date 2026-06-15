<div align="center">
  <img src="./public/header.png" alt="ArachnidForms" width="800" />
  <h1>ArachnidForms</h1>
  <p>
    <b>A modern, high-performance form builder built on the Next.js App Router.</b>
  </p>
  <p>
    <img src="https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge&color=000000&labelColor=222222" alt="Version" />
    <img src="https://img.shields.io/badge/Next.js-14.0+-black?style=for-the-badge&logo=next.js&color=000000&labelColor=222222" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript&color=000000&labelColor=222222" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&color=000000&labelColor=222222" alt="License" />
  </p>
  <p>
    <a href="#overview">Overview</a> &nbsp;•&nbsp;
    <a href="#features">Features</a> &nbsp;•&nbsp;
    <a href="#tech-stack">Tech Stack</a> &nbsp;•&nbsp;
    <a href="#getting-started">Getting Started</a> &nbsp;•&nbsp;
    <a href="#documentation">Documentation</a>
  </p>
</div>

---

## Overview

ArachnidForms is a visual form builder designed for creators, businesses, and developers who require complex form logic without operational overhead. It provides a node-based drag-and-drop canvas, real-time conditional branching, and a streamlined respondent experience — all within a single, self-hostable application.

---

## Features

**Visual Node Builder**
Compose forms on a free-form infinite canvas. Questions are represented as nodes and connected via edges, giving you a clear visual map of your form's entire flow.

**Conditional Logic Branching**
Insert Logic Nodes to dynamically route respondents to different questions based on prior answers, enabling sophisticated survey paths and decision trees.

**Focused Respondent Experience**
Respondents see one question at a time with full keyboard navigation support, reducing friction and improving completion rates.

**Template Gallery**
Bootstrap new forms using a curated library of templates that ship as fully wired, ready-to-use node graphs.

**Comprehensive Form Modules**
Build forms with a diverse array of input blocks, including newly added modules like Matrix, NPS (Net Promoter Score), Image Choice, Ranking, Consent checkmarks, Video/Audio embedding, and custom HTML/Section blocks.

**Strict Backend Validation & Error Handling**
All form inputs are strictly validated on the server side against their respective types. Attempting to submit invalid emails, missing required fields, out-of-range numbers, or manipulated dropdown options will instantly be caught and gracefully rejected, preventing corrupted data and rendering clear frontend error states.

**Analytics Dashboard**
Automatically generated pie and bar charts for multiple-choice and rating questions, providing immediate insight into response distributions.

**CSV Export**
Download all form responses directly to your local device with a single action. No third-party data intermediaries involved.

**Spam Protection**
Google reCAPTCHA v3 is integrated at the form level to silently block bot submissions. Users may supply their own reCAPTCHA API keys via the dashboard settings.

---

## Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | `Next.js 14` | React framework using the App Router |
| **Language** | `TypeScript` | End-to-end static typing |
| **Database** | `PostgreSQL` | Primary relational data store |
| **ORM** | `Prisma` | Type-safe database client and schema management |
| **Authentication** | `Auth.js` | Session management and OAuth provider integration |
| **Styling** | `Tailwind CSS` | Utility-first CSS framework |
| **UI Components** | `Shadcn UI` | Accessible, composable component primitives |
| **Canvas** | `React Flow` | Node and edge rendering for the form builder |
| **Charts** | `Recharts` | Composable charting library built on React |

---

## Getting Started

### Prerequisites

Ensure the following are installed on your local machine before proceeding:

- **Node.js** v18.17 or higher
- **npm** v9+ (or **yarn**)
- **Git**
- **PostgreSQL** — local installation, or a hosted instance such as Supabase or Neon

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/arachnidforms.git
cd arachnidforms
```

Install dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Duplicate the example environment file:

```bash
cp .env.example .env
```

Open `.env` and set the following variables:

**`DATABASE_URL`**
Your PostgreSQL connection string. If you are using a connection pooler such as Supabase PgBouncer, append `?pgbouncer=true` to the URL.

**`AUTH_SECRET`**
A secure random string used by Auth.js to encrypt sessions. Generate one with:

```bash
openssl rand -base64 32
```

**`OAuth Providers`** _(optional)_
To enable Google or Discord login, provide the corresponding `CLIENT_ID` and `CLIENT_SECRET` values. If omitted, the application remains accessible via the built-in Test Mode.

**`reCAPTCHA`** _(optional)_
Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` to enable spam protection on forms. Individual users may also configure their own keys from the dashboard settings.

### 3. Initialize the Database

Generate the Prisma TypeScript client:

```bash
npx prisma generate
```

Push the schema to your PostgreSQL instance to create all required tables:

```bash
npx prisma db push
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the URL specified in `AUTH_URL`).

### 5. Accessing the Dashboard

On first load, click the login or sign-up button. If OAuth providers have not been configured, select **"Go in test mode"** to provision a temporary account and proceed directly to the builder dashboard.

---

## Documentation

In-application documentation covering advanced configuration, custom node development, and API key management is available under the **Docs & Setup** section of the dashboard.

**Form Nodes** — Schema structure and field definitions required to implement new node types.

**Webhooks** — Configure endpoints to receive real-time form submission payloads.

**Analytics** — Exported data structures and chart implementation details.

---

<div align="center">
  <p>Built with precision and performance in mind.</p>
</div>

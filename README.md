# ArachnidForms 🕷️

ArachnidForms is a modern, high-performance form builder built on the Next.js 14 App Router. Designed for creators, businesses, and developers who need complex forms without the hassle. It features a powerful drag-and-drop node-based builder (using React Flow), real-time conditional logic, and a beautifully interactive "Typeform-style" respondent experience.

## ✨ Features

- **Visual Node Builder**: Build your forms using a completely free-form infinite canvas. Connect questions with edges just like a flowchart!
- **Smart Logic Branching**: Use Logic Nodes to dynamically skip or route users to different questions based on their previous answers.
- **Typeform-style Viewer**: Respondents get a sleek, focused, one-question-at-a-time experience with keyboard navigation (Enter to proceed).
- **Template Gallery**: Jumpstart your workflow with dozens of intelligent templates that auto-generate fully connected, ready-to-use form flows.
- **Visual Analytics Dashboard**: Automatically generated Pie Charts and Bar Charts (via Recharts) for multiple-choice and rating questions.
- **CSV Data Export**: Export all your form responses with a single click securely to your device.
- **SEO Ready**: Dynamic OpenGraph tags and metadata so your shared form links look beautiful on Twitter, Discord, and Slack.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [Auth.js](https://authjs.dev/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Canvas Engine**: [React Flow](https://reactflow.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your environment variables by copying `.env.example` to `.env` and adding your PostgreSQL connection URL and Auth secret:

```bash
cp .env.example .env
```

Generate the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

Run the development server:

```bash
npm run dev
```

Open [https://anachnidforms.vercel.app](https://anachnidforms.vercel.app) with your browser to see the result.

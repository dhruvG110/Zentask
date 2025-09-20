ZenTask 🧘‍♂️✨
Turn complexity into clarity. ZenTask is a modern, AI-powered productivity dashboard designed to take your problems and goals and break them down into clear, actionable steps.

## Live Demo 🚀
## Core Features
🤖 AI-Powered Task Generation: Describe a problem, and ZenTask uses the Gemini API to generate a 7-step action plan, automatically creating a main task and seven subtasks.

✅ Full Task Management: Complete CRUD (Create, Read, Update, Delete) functionality for tasks and their nested subtasks.

🍅 Integrated Pomodoro Timer: A built-in timer with focus, short break, and long break modes to help you manage work sessions and stay in the zone.

📊 Productivity Analytics: A dedicated analytics page with charts to track your daily streak, tasks completed, and focus sessions over time.

⚙️ User Settings: Customize timer durations to fit your personal workflow.

🔐 Secure Authentication: User accounts and authentication are securely managed by Clerk.

🎨 Sleek & Responsive UI: A minimalist interface with light and dark modes, built with Tailwind CSS and shadcn/ui.

<hr/>

## Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

ORM: Drizzle ORM

Database: PostgreSQL (Neon)

Authentication: Clerk

Styling: Tailwind CSS

UI Components: shadcn/ui

AI: Google Gemini API

Deployment: Netlify

<hr/>

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
Node.js (v18 or later)

npm or your preferred package manager

A PostgreSQL database URL

### Installation
Clone the repository:

Bash

git clone https://github.com/your-username/zentask.git
cd zentask
Install dependencies:

Bash

npm install
Set up environment variables:
Create a .env.local file in the project root and add your secret keys.

Code snippet

# From your database provider (e.g., Neon)
DATABASE_URL="postgres://..."

# From your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# From Google AI Studio
GEMINI_API_KEY=...
Run database migrations:
This syncs your schema with the database, creating the necessary tables.

Bash

npx tsx src/lib/migrate.ts
Run the development server:

Bash

npm run dev
Your site should now be running on http://localhost:3000.

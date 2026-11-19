Copilot instructions for StudyTrack

StudyTrack is a student study planner built by WDD 430 Team 02. Students register, log in, and manage their own assignments, study sessions, deadlines, and progress. Keep suggestions consistent with the decisions below.

Stack (use these versions' APIs)
Next.js 16 (App Router, Turbopack) with cacheComponents and partialPrefetching turned on in next.config.ts. This version has breaking changes: check node_modules/next/dist/docs/ before using an API you're unsure of.
Request middleware lives in proxy.ts (Next.js 16 renamed middleware.ts).
Anything that reads the session, cookies, headers, or uncached data must render inside <Suspense>.
Page and route params and searchParams are Promises: await them. Use the generated PageProps<"/route">, LayoutProps<"/route"> and RouteContext<"/route"> types.
React 19, TypeScript (strict; never use any), Tailwind CSS 4.
Supabase PostgreSQL with Prisma 7.10.1. The client is generated into generated/prisma (import from @/generated/prisma/client) and uses the @prisma/adapter-pg driver adapter. Only use the shared client in lib/prisma.ts.
Auth.js v5 (next-auth 5.0.0-beta.32) with the Credentials provider (email and password), bcrypt-hashed passwords, and JWT sessions. Config: auth.config.ts (edge-safe, no database code) and auth.ts.
Zod 4 for all validation (lib/validation.ts).
Hosting on Vercel.
Data model (prisma/schema.prisma)
User: id, name, email (unique), passwordHash, createdAt, updatedAt. Table users.
Assignment: id, userId, title, description?, dueDate (date stored at UTC midnight), status PENDING | COMPLETED, timestamps. Table assignments.
StudySession: id, userId, topic, scheduledAt (a moment in time), durationMinutes, notes?, status PLANNED | COMPLETED | CANCELLED, timestamps. Table study_sessions.
A User has many Assignments and many StudySessions (cascade delete). Columns use snake_case through @map; TypeScript uses camelCase.
Schema changes: edit prisma/schema.prisma, then run npm run db:migrate -- --name <change> and commit the migration folder. Every new table must enable row-level security in its migration (ALTER TABLE "x" ENABLE ROW LEVEL SECURITY;). Never edit tables in the Supabase dashboard.
Security rules (always)
Get the signed-in student only from lib/dal.ts: requireUser() in pages and Server Actions, getCurrentUser() in API routes (return 401 when it's null).
Never trust a user id from the browser. Every query includes the signed-in user's id: findMany({ where: { userId: user.id } }), and updateMany or deleteMany with both id and userId (return 404 when nothing matched).
Validate every request body with a Zod schema from lib/validation.ts before touching the database.
Never commit .env or .env.local, and never put secrets in code.
Project structure and patterns
app/(auth)/: login and register pages plus their Server Actions (actions.ts).
app/dashboard, app/assignments, app/study-sessions, app/deadlines: signed-in pages. Each has a layout.tsx that wraps the page in components/nav/AppShell.tsx. New private sections must be added to PROTECTED_PREFIXES in auth.config.ts and to NAV_ITEMS in components/nav/NavLinks.tsx.
app/api/<resource>/route.ts (GET, POST) and app/api/<resource>/[id]/route.ts (PATCH, DELETE) return JSON. Use the helpers in lib/api.ts (unauthorized, notFound, validationError, readJson, badJson).
Feature data access lives in lib/<feature>.ts (for example lib/assignments.ts, lib/study-sessions.ts), marked import "server-only", returning plain DTOs (dates as strings).
Pattern for a feature page: a Server Component loads the first data with requireUser() plus the lib/ function inside <Suspense>, then passes it to a Client Component (components/<feature>/<Feature>Manager.tsx) that calls the API routes with fetch for changes.
Shared browser-safe helpers: lib/assignment-utils.ts, lib/study-session-utils.ts.
Dates: assignment due dates are "YYYY-MM-DD" strings compared as strings. Study session times are ISO strings, shown in the viewer's own time zone and formatted only in the browser.
Naming and style
Components: PascalCase files and names (StudySessionManager.tsx). Older auth components use kebab-case files (login-form.tsx); keep those as they are.
Variables and functions: camelCase. Enum values: UPPER_CASE (PENDING). Database tables and columns: snake_case.
Path alias @/ for imports from the project root.
Branches: feature/<short-name>. Commit messages say what changed and reference the issue ((#6)). Every change goes through a Pull Request reviewed by a teammate.
Design and accessibility
Primary color blue 
#2563EB (Tailwind blue-600), slate grays for text and borders, green for completed, yellow or amber for pending, red for overdue and errors. Font: Inter.
White rounded-xl cards with shadow-sm, p-5 or p-6 inside cards, gap-4 to gap-8 between sections. Layouts must work from 320px wide with no horizontal scrolling.
Every input has a visible <label htmlFor>. Errors appear next to the field, linked with aria-describedby and aria-invalid. Use role="alert" for form-level errors and an aria-live="polite" region for success messages. Buttons and links have visible focus-visible outlines. Icon-only or repeated buttons get an aria-label naming the item.
Show a friendly empty state instead of an empty list, and "Unavailable" instead of 0% when there is no data to calculate progress from.

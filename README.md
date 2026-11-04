# StudyTrack – Student Study Planner

StudyTrack is a web application that helps students organize schoolwork and manage their time. Students can keep track of assignments, plan study activities, remember deadlines, and monitor their progress. The app is designed to work on phones and computers.

## Problem

Students can find it difficult to manage assignments, study time, and deadlines. StudyTrack helps them stay organized, avoid missed assignments, and complete their schoolwork on time.

## MVP features

- Create an account, log in, and log out
- Add, view, edit, and delete assignments
- Plan and manage study activities
- See upcoming assignment deadlines
- Mark assignments complete and track progress

## Planned data

- **Assignment:** A student's task, details, due date, and completion status
- **Study session:** A planned study activity and its scheduled time

The team will confirm the final data model in the project specification.

## Technology

- Next.js with the App Router
- TypeScript
- Tailwind CSS
- Database: **To be decided by the team**
- Authentication: **To be decided by the team** (Auth.js v5 or Clerk)
- Hosting: **To be decided by the team**

## Getting started

### Prerequisites

- Node.js compatible with the installed Next.js version
- npm

### Install and run locally

```bash
git clone https://github.com/JaOnwude/studytrack-student-planner.git
cd studytrack-student-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Checks the code with ESLint, if this script is configured in `package.json`.

## Team members

- **Onwude James Uchenna** 
- **Nsikak Christopher Eyo** 
- **Precious Ayomide Fabiyi** 
- **Phoebe** — Team member; participation pending

Update team roles and participation as the team agrees.

## Team workflow

- Create a feature branch for each task, such as `feature/assignment-crud`.
- Do not push feature work directly to `main`.
- Open a pull request to merge work into `main`.
- Have at least one other team member review each pull request before merging.
- Track tasks and blockers on the GitHub Project board.

## Project links

- Repository: [StudyTrack on GitHub](https://github.com/JaOnwude/studytrack-student-planner)
- GitHub Project board: To be added
- Project specification: To be added
- Deployed application: To be added

## Next.js resources

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- [Next.js documentation](https://nextjs.org/docs)
- [Next.js App Router guide](https://nextjs.org/docs/app)

## Project status

The team selected StudyTrack as its project direction. The MVP scope, database, authentication provider, and hosting platform will be finalized in the project specification.
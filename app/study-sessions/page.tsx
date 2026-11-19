import type { Metadata } from "next";
import { Suspense } from "react";
import StudySessionManager from "@/components/study-sessions/StudySessionManager";
import { requireUser } from "@/lib/dal";
import { listStudySessions } from "@/lib/study-sessions";

export const metadata: Metadata = {
  title: "Study Sessions",
};

export default function StudySessionsPage() {
  return (
    // With cacheComponents on, anything that reads the session must sit inside Suspense.
    <Suspense fallback={<p className="text-slate-600">Loading your study sessions…</p>}>
      <StudySessions />
    </Suspense>
  );
}

// Loads the signed-in student's sessions on the server for the first render.
// After that, StudySessionManager talks to /api/study-sessions from the browser.
async function StudySessions() {
  const user = await requireUser();
  const sessions = await listStudySessions(user.id);
  return <StudySessionManager initialSessions={sessions} />;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import AssignmentManager from "@/components/assignments/AssignmentManager";
import { listAssignments } from "@/lib/assignments";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Assignments",
  description:
    "Add, edit, complete, and delete your assignments and due dates.",
};

export default function AssignmentsPage() {
  return (
    // With cacheComponents on, anything that reads the session must sit inside Suspense.
    <Suspense fallback={<p className="text-slate-600">Loading your assignments…</p>}>
      <Assignments />
    </Suspense>
  );
}

// Loads the signed-in student's assignments on the server for the first render.
// After that, AssignmentManager talks to /api/assignments from the browser.
async function Assignments() {
  const user = await requireUser();
  const assignments = await listAssignments(user.id);
  return <AssignmentManager initialAssignments={assignments} />;
}

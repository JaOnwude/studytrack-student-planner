import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { listAssignments } from "@/lib/assignments";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    // With cacheComponents on, anything that reads the session must sit inside Suspense.
    <Suspense fallback={<p className="text-slate-600">Loading your planner…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireUser();
  const assignments = await listAssignments(user.id);
  return <DashboardSummary name={user.name} assignments={assignments} />;
}

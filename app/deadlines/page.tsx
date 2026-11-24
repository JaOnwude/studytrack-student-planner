import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  formatDueDate,
  isOverdue,
  summarize,
  todayLocal,
} from "@/lib/assignment-utils";
import { listAssignments } from "@/lib/assignments";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Assignment Deadlines",
};

export default function DeadlinesPage() {
  return (
    <Suspense fallback={<p className="text-slate-600">Loading your deadlines…</p>}>
      <Deadlines />
    </Suspense>
  );
}

async function Deadlines() {
  const user = await requireUser();
  const assignments = await listAssignments(user.id);
  const today = todayLocal();

  const overdue = assignments.filter((a) => isOverdue(a, today));
  const upcoming = assignments.filter(
    (a) => a.status === "PENDING" && a.dueDate >= today,
  );
  const completed = assignments.filter((a) => a.status === "COMPLETED");
  const summary = summarize(assignments, today);

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Assignment Deadlines
        </h1>
        <p className="mt-2 text-slate-600">
          Monitor your upcoming deadlines and stay on top of your academic work.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total assignments" value={summary.total} />
        <SummaryCard label="Upcoming" value={upcoming.length} />
        <SummaryCard label="Overdue" value={overdue.length} />
        <SummaryCard label="Completed" value={completed.length} />
      </div>

      <DeadlineSection
        title="Overdue assignments"
        count={overdue.length}
        emptyMessage="You have no overdue assignments. Great work!"
      >
        {overdue.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            title={assignment.title}
            dueDate={assignment.dueDate}
            status="Overdue"
            color="red"
          />
        ))}
      </DeadlineSection>

      <DeadlineSection
        title="Upcoming assignments"
        count={upcoming.length}
        emptyMessage="No upcoming deadlines. Add an assignment to get started."
      >
        {upcoming.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            title={assignment.title}
            dueDate={assignment.dueDate}
            status={assignment.dueDate === today ? "Due today" : "Upcoming"}
            color={assignment.dueDate === today ? "amber" : "blue"}
          />
        ))}
      </DeadlineSection>

      <DeadlineSection
        title="Completed assignments"
        count={completed.length}
        emptyMessage="Completed assignments will appear here."
      >
        {completed.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            title={assignment.title}
            dueDate={assignment.dueDate}
            status="Completed"
            color="green"
          />
        ))}
      </DeadlineSection>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/assignments"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Manage Assignments
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DeadlineSection({
  title,
  count,
  emptyMessage,
  children,
}: {
  title: string;
  count: number;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {count}
        </span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {count === 0 ? (
          <p className="p-5 text-sm text-slate-600">{emptyMessage}</p>
        ) : (
          <div className="divide-y divide-slate-100">{children}</div>
        )}
      </div>
    </section>
  );
}

function AssignmentRow({
  title,
  dueDate,
  status,
  color,
}: {
  title: string;
  dueDate: string;
  status: string;
  color: "red" | "amber" | "blue" | "green";
}) {
  const colors = {
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          Due: {formatDueDate(dueDate)}
        </p>
      </div>
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}>
        {status}
      </span>
    </div>
  );
}

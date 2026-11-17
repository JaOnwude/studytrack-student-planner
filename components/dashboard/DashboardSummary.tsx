"use client";

import Link from "next/link";
import { useState } from "react";
import type { AssignmentDTO } from "@/lib/assignments";
import { formatDueDate, isOverdue, summarize, todayLocal } from "@/lib/assignment-utils";

const UPCOMING_LIMIT = 5;

// Client component so "today" and "overdue" use the student's own time zone.
export function DashboardSummary({ name, assignments }: { name: string; assignments: AssignmentDTO[] }) {
  const [today] = useState(() => todayLocal());
  const summary = summarize(assignments, today);
  const upcoming = assignments
    .filter((a) => a.status === "PENDING")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, UPCOMING_LIMIT);

  const stats = [
    { label: "Pending", value: String(summary.pending), tone: "text-3xl text-blue-600" },
    {
      label: "Overdue",
      value: String(summary.overdue),
      tone: summary.overdue > 0 ? "text-3xl text-red-700" : "text-3xl text-slate-900",
    },
    { label: "Completed", value: String(summary.completed), tone: "text-3xl text-green-700" },
    {
      label: "Progress",
      value: summary.percent === null ? "Unavailable" : `${summary.percent}%`,
      tone: summary.percent === null ? "text-lg text-slate-500" : "text-3xl text-blue-600",
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {name}</h1>
        <p className="mt-2 text-slate-600">Here&apos;s where your coursework stands today.</p>
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`mt-2 font-bold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="upcoming-heading" className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="upcoming-heading" className="text-xl font-semibold text-slate-900">
            Upcoming deadlines
          </h2>
          <Link
            href="/assignments"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Manage assignments →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-slate-600">
              {summary.total === 0 ? "You haven't added any assignments yet." : "You're all caught up. Nothing is pending."}
            </p>
            <Link
              href="/assignments"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add an assignment
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {upcoming.map((assignment) => {
              const overdue = isOverdue(assignment, today);
              return (
                <li key={assignment.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="min-w-0 break-words font-medium text-slate-900">{assignment.title}</span>
                  <span className={`text-sm ${overdue ? "font-semibold text-red-700" : "text-slate-600"}`}>
                    {overdue ? "Overdue · " : "Due "}
                    {formatDueDate(assignment.dueDate)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

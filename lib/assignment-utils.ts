// Helpers shared by the dashboard and the assignments page. Safe to use in the browser.
// They take dates as "YYYY-MM-DD" strings, so comparisons are simple string compares.

export type AssignmentStatus = "PENDING" | "COMPLETED";

type AssignmentLike = { dueDate: string; status: AssignmentStatus };

export const STATUS_LABEL: Record<AssignmentStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

/** Today's date in the student's own time zone, as "YYYY-MM-DD". */
export function todayLocal(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** A pending assignment whose due date is before today. */
export function isOverdue(assignment: AssignmentLike, today: string): boolean {
  return assignment.status === "PENDING" && assignment.dueDate < today;
}

/** "Fri, 20 Nov 2026". */
export function formatDueDate(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type ProgressSummary = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  /** null when there are no assignments, so the UI can show "Unavailable" instead of 0%. */
  percent: number | null;
};

export function summarize(assignments: AssignmentLike[], today: string): ProgressSummary {
  const completed = assignments.filter((a) => a.status === "COMPLETED").length;
  const total = assignments.length;
  return {
    total,
    completed,
    pending: total - completed,
    overdue: assignments.filter((a) => isOverdue(a, today)).length,
    percent: total === 0 ? null : Math.round((completed / total) * 100),
  };
}

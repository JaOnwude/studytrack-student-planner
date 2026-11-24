// Helpers for the study sessions page. Safe to use in the browser.

export type StudySessionStatus = "PLANNED" | "COMPLETED" | "CANCELLED";

type SessionLike = { scheduledAt: string; durationMinutes: number; status: StudySessionStatus };

export const SESSION_STATUS_LABEL: Record<StudySessionStatus, string> = {
  PLANNED: "Planned",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

/** "Fri, 20 Nov 2026, 14:00", in the viewer's own time zone. */
export function formatSessionTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 45 -> "45 min", 90 -> "1 h 30 min", 120 -> "2 h". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

/** ISO moment -> the "YYYY-MM-DDTHH:mm" value a datetime-local input expects, in local time. */
export function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** A datetime-local value (the student's local time) -> an ISO moment, or null if invalid. */
export function fromLocalInputValue(value: string): string | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** A planned session whose start time has already passed. */
export function isPastPlanned(session: SessionLike, now: Date): boolean {
  return session.status === "PLANNED" && new Date(session.scheduledAt).getTime() < now.getTime();
}

export type SessionSummary = {
  planned: number;
  upcoming: number;
  completed: number;
  /** Total minutes of completed sessions. */
  minutesStudied: number;
};

export function summarizeSessions(sessions: SessionLike[], now: Date): SessionSummary {
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const planned = sessions.filter((s) => s.status === "PLANNED");
  return {
    planned: planned.length,
    upcoming: planned.filter((s) => !isPastPlanned(s, now)).length,
    completed: completed.length,
    minutesStudied: completed.reduce((total, s) => total + s.durationMinutes, 0),
  };
}

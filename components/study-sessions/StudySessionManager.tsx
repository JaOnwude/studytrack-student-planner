"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import type { StudySessionDTO } from "@/lib/study-sessions";
import {
  SESSION_STATUS_LABEL,
  formatDuration,
  formatSessionTime,
  fromLocalInputValue,
  isPastPlanned,
  summarizeSessions,
  toLocalInputValue,
  type StudySessionStatus,
} from "@/lib/study-session-utils";

type FieldName = "topic" | "scheduledAt" | "durationMinutes" | "notes" | "status";
type FieldErrors = Partial<Record<FieldName, string[]>>;

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors; signedOut?: boolean };

// Calls one of the /api/study-sessions routes and returns its JSON or a readable error.
async function callApi<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (response.status === 401) {
      return { ok: false, error: "Your session has ended. Please log in again.", signedOut: true };
    }
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      return { ok: false, error: data?.error ?? "Something went wrong.", fieldErrors: data?.fieldErrors };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Check your connection and try again." };
  }
}

// Times must be shown in the viewer's time zone, which the server doesn't know.
// useSyncExternalStore returns false while rendering on the server and during
// hydration, then true in the browser, so the time is only formatted client-side.
const noSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

function LocalTime({ iso }: { iso: string }) {
  const isClient = useIsClient();
  return <time dateTime={iso}>{isClient ? formatSessionTime(iso) : "…"}</time>;
}

const STATUS_BADGE: Record<StudySessionStatus, string> = {
  PLANNED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

const DEFAULT_DURATION = "60";

export default function StudySessionManager({ initialSessions }: { initialSessions: StudySessionDTO[] }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<StudySessionDTO[]>(initialSessions);

  const [topic, setTopic] = useState("");
  const [scheduledAt, setScheduledAt] = useState(""); // datetime-local value, local time
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<StudySessionStatus>("PLANNED");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [busyId, setBusyId] = useState<string | null>(null); // "form" or a session id
  const [announcement, setAnnouncement] = useState("");

  const [now] = useState(() => new Date());
  const summary = summarizeSessions(sessions, now);

  const byTime = (a: StudySessionDTO, b: StudySessionDTO) => a.scheduledAt.localeCompare(b.scheduledAt);
  const upcoming = sessions.filter((s) => s.status === "PLANNED" && !isPastPlanned(s, now)).sort(byTime);
  const earlier = sessions
    .filter((s) => !(s.status === "PLANNED" && !isPastPlanned(s, now)))
    .sort((a, b) => byTime(b, a)); // newest first

  // Shows the error, and sends the student to log in again if their session ended.
  function handleFailure(result: { error: string; signedOut?: boolean }) {
    if (result.signedOut) router.push("/login");
    return result.error;
  }

  function resetForm() {
    setTopic("");
    setScheduledAt("");
    setDurationMinutes(DEFAULT_DURATION);
    setNotes("");
    setStatus("PLANNED");
    setEditingId(null);
    setError("");
    setFieldErrors({});
  }

  function replaceSession(updated: StudySessionDTO) {
    setSessions((current) => current.map((s) => (s.id === updated.id ? updated : s)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const scheduledIso = scheduledAt ? fromLocalInputValue(scheduledAt) : null;
    const duration = Number(durationMinutes);
    const errors: FieldErrors = {};
    if (!topic.trim()) errors.topic = ["Enter what you will study."];
    if (!scheduledIso) errors.scheduledAt = ["Choose a date and time."];
    if (!Number.isInteger(duration) || duration < 5 || duration > 600) {
      errors.durationMinutes = ["Enter a whole number of minutes between 5 and 600."];
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = { topic: topic.trim(), scheduledAt: scheduledIso, durationMinutes: duration, notes: notes.trim() };
    setBusyId("form");
    const result =
      editingId !== null
        ? await callApi<{ studySession: StudySessionDTO }>(`/api/study-sessions/${editingId}`, {
            method: "PATCH",
            body: JSON.stringify({ ...payload, status }),
          })
        : await callApi<{ studySession: StudySessionDTO }>("/api/study-sessions", {
            method: "POST",
            body: JSON.stringify(payload),
          });
    setBusyId(null);

    if (!result.ok) {
      setError(handleFailure(result));
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    if (editingId !== null) {
      replaceSession(result.data.studySession);
      setAnnouncement(`Saved changes to "${result.data.studySession.topic}".`);
    } else {
      setSessions((current) => [...current, result.data.studySession]);
      setAnnouncement(`Added study session "${result.data.studySession.topic}".`);
    }
    resetForm();
  }

  function handleEdit(session: StudySessionDTO) {
    setEditingId(session.id);
    setTopic(session.topic);
    setScheduledAt(toLocalInputValue(session.scheduledAt));
    setDurationMinutes(String(session.durationMinutes));
    setNotes(session.notes);
    setStatus(session.status);
    setError("");
    setFieldErrors({});
    document.getElementById("topic")?.focus();
  }

  async function setSessionStatus(session: StudySessionDTO, next: StudySessionStatus) {
    setBusyId(session.id);
    const result = await callApi<{ studySession: StudySessionDTO }>(`/api/study-sessions/${session.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    setBusyId(null);

    if (!result.ok) {
      setAnnouncement(handleFailure(result));
      return;
    }
    replaceSession(result.data.studySession);
    setAnnouncement(`Marked "${session.topic}" as ${SESSION_STATUS_LABEL[next].toLowerCase()}.`);
  }

  async function handleDelete(session: StudySessionDTO) {
    if (!window.confirm(`Delete the study session "${session.topic}"? This can't be undone.`)) return;

    setBusyId(session.id);
    const result = await callApi<null>(`/api/study-sessions/${session.id}`, { method: "DELETE" });
    setBusyId(null);

    if (!result.ok) {
      setAnnouncement(handleFailure(result));
      return;
    }
    setSessions((current) => current.filter((s) => s.id !== session.id));
    if (editingId === session.id) resetForm();
    setAnnouncement(`Deleted "${session.topic}".`);
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
      hasError ? "border-red-600" : "border-slate-300 focus:border-blue-500"
    }`;

  function fieldError(name: FieldName) {
    const messages = fieldErrors[name];
    return messages ? (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
        {messages.join(" ")}
      </p>
    ) : null;
  }

  // A plain render function (not a nested component), so React doesn't remount items.
  function renderSession(session: StudySessionDTO) {
    const busy = busyId === session.id;
    const missed = isPastPlanned(session, now);
    const actionClass =
      "rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60";

    return (
      <li key={session.id} className="rounded-lg border border-slate-200 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="min-w-0">
            <h3 className="break-words font-semibold text-slate-900">{session.topic}</h3>
            <p className="mt-2 text-sm text-slate-600">
              <LocalTime iso={session.scheduledAt} /> · {formatDuration(session.durationMinutes)}
            </p>
            {session.notes && <p className="mt-2 break-words text-sm text-slate-600">{session.notes}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[session.status]}`}>
                {SESSION_STATUS_LABEL[session.status]}
              </span>
              {missed && (
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                  Time has passed
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session.status !== "COMPLETED" && (
              <button
                type="button"
                onClick={() => setSessionStatus(session, "COMPLETED")}
                disabled={busy}
                aria-label={`Mark completed: ${session.topic}`}
                className={`${actionClass} bg-green-50 text-green-800 hover:bg-green-100`}
              >
                Completed
              </button>
            )}
            {session.status === "PLANNED" && (
              <button
                type="button"
                onClick={() => setSessionStatus(session, "CANCELLED")}
                disabled={busy}
                aria-label={`Cancel: ${session.topic}`}
                className={`${actionClass} bg-slate-100 text-slate-800 hover:bg-slate-200`}
              >
                Cancel session
              </button>
            )}
            {session.status !== "PLANNED" && (
              <button
                type="button"
                onClick={() => setSessionStatus(session, "PLANNED")}
                disabled={busy}
                aria-label={`Mark planned again: ${session.topic}`}
                className={`${actionClass} bg-slate-100 text-slate-800 hover:bg-slate-200`}
              >
                Plan again
              </button>
            )}
            <button
              type="button"
              onClick={() => handleEdit(session)}
              disabled={busy}
              aria-label={`Edit: ${session.topic}`}
              className={`${actionClass} bg-blue-50 text-blue-700 hover:bg-blue-100`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(session)}
              disabled={busy}
              aria-label={`Delete: ${session.topic}`}
              className={`${actionClass} bg-red-50 text-red-700 hover:bg-red-100`}
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    );
  }

  const stats = [
    { label: "Upcoming", value: String(summary.upcoming), tone: "text-blue-600" },
    { label: "Completed", value: String(summary.completed), tone: "text-green-700" },
    {
      label: "Time studied",
      value: summary.minutesStudied === 0 ? "0 min" : formatDuration(summary.minutesStudied),
      tone: "text-blue-600",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Study Sessions</h1>
        <p className="mt-2 text-slate-600">Plan your study time and keep track of the sessions you finish.</p>
      </header>

      {/* Screen readers hear the result of each add, edit, delete or status change. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <section aria-label="Study summary" className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.tone}`} suppressHydrationWarning>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-900">
          {editingId !== null ? "Edit Study Session" : "Plan a Study Session"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="topic" className="mb-1 block text-sm font-medium text-slate-700">
              Topic *
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Chapter 5 review for the biology quiz"
              maxLength={200}
              aria-invalid={Boolean(fieldErrors.topic)}
              aria-describedby={fieldErrors.topic ? "topic-error" : undefined}
              className={inputClass(Boolean(fieldErrors.topic))}
              required
            />
            {fieldError("topic")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="scheduledAt" className="mb-1 block text-sm font-medium text-slate-700">
                Date and time *
              </label>
              <input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                aria-invalid={Boolean(fieldErrors.scheduledAt)}
                aria-describedby={fieldErrors.scheduledAt ? "scheduledAt-error" : undefined}
                className={inputClass(Boolean(fieldErrors.scheduledAt))}
                required
              />
              {fieldError("scheduledAt")}
            </div>

            <div>
              <label htmlFor="durationMinutes" className="mb-1 block text-sm font-medium text-slate-700">
                Length in minutes *
              </label>
              <input
                id="durationMinutes"
                type="number"
                inputMode="numeric"
                min={5}
                max={600}
                step={5}
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                aria-invalid={Boolean(fieldErrors.durationMinutes)}
                aria-describedby={
                  fieldErrors.durationMinutes ? "durationMinutes-hint durationMinutes-error" : "durationMinutes-hint"
                }
                className={inputClass(Boolean(fieldErrors.durationMinutes))}
                required
              />
              <p id="durationMinutes-hint" className="mt-1 text-sm text-slate-500">
                Between 5 and 600 minutes.
              </p>
              {fieldError("durationMinutes")}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="What do you want to cover?"
              rows={3}
              maxLength={2000}
              aria-invalid={Boolean(fieldErrors.notes)}
              aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
              className={inputClass(Boolean(fieldErrors.notes))}
            />
            {fieldError("notes")}
          </div>

          {editingId !== null && (
            <div className="sm:w-1/2">
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StudySessionStatus)}
                className={inputClass(false)}
              >
                <option value="PLANNED">Planned</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busyId === "form"}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
            >
              {busyId === "form" ? "Saving…" : editingId !== null ? "Save Changes" : "Add Study Session"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section aria-labelledby="upcoming-sessions" className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 id="upcoming-sessions" className="mb-5 text-xl font-semibold text-slate-900">
          Upcoming Sessions
        </h2>
        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-slate-500">No upcoming study sessions. Plan one above.</p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map(renderSession)}
          </ul>
        )}
      </section>

      <section aria-labelledby="earlier-sessions" className="rounded-xl bg-white p-6 shadow-sm">
        <h2 id="earlier-sessions" className="mb-5 text-xl font-semibold text-slate-900">
          Earlier Sessions
        </h2>
        {earlier.length === 0 ? (
          <p className="py-6 text-center text-slate-500">Completed, cancelled and past sessions will appear here.</p>
        ) : (
          <ul className="space-y-4">
            {earlier.map(renderSession)}
          </ul>
        )}
      </section>
    </div>
  );
}

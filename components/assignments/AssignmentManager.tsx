"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AssignmentDTO } from "@/lib/assignments";
import {
  STATUS_LABEL,
  formatDueDate,
  isOverdue,
  summarize,
  todayLocal,
  type AssignmentStatus,
} from "@/lib/assignment-utils";

type FieldErrors = Partial<Record<"title" | "description" | "dueDate" | "status", string[]>>;

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors; signedOut?: boolean };

// Calls one of the /api/assignments routes and returns its JSON or a readable error.
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

function byDueDate(a: AssignmentDTO, b: AssignmentDTO) {
  return a.dueDate.localeCompare(b.dueDate);
}

export default function AssignmentManager({ initialAssignments }: { initialAssignments: AssignmentDTO[] }) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentDTO[]>(initialAssignments);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<AssignmentStatus>("PENDING");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [busyId, setBusyId] = useState<string | null>(null); // "form" or an assignment id
  const [announcement, setAnnouncement] = useState("");

  const [today] = useState(() => todayLocal());
  const summary = summarize(assignments, today);
  const sortedAssignments = [...assignments].sort(byDueDate);

  // Shows the error, and sends the student to log in again if their session ended.
  function handleFailure(result: { error: string; signedOut?: boolean }) {
    if (result.signedOut) router.push("/login");
    return result.error;
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("PENDING");
    setEditingId(null);
    setError("");
    setFieldErrors({});
  }

  function replaceAssignment(updated: AssignmentDTO) {
    setAssignments((current) => current.map((a) => (a.id === updated.id ? updated : a)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (!title.trim() || !dueDate) {
      setFieldErrors({
        ...(!title.trim() && { title: ["Enter an assignment title."] }),
        ...(!dueDate && { dueDate: ["Choose a due date."] }),
      });
      return;
    }

    const payload = { title: title.trim(), description: description.trim(), dueDate };
    setBusyId("form");
    const result =
      editingId !== null
        ? await callApi<{ assignment: AssignmentDTO }>(`/api/assignments/${editingId}`, {
            method: "PATCH",
            body: JSON.stringify({ ...payload, status }),
          })
        : await callApi<{ assignment: AssignmentDTO }>("/api/assignments", {
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
      replaceAssignment(result.data.assignment);
      setAnnouncement(`Saved changes to "${result.data.assignment.title}".`);
    } else {
      setAssignments((current) => [...current, result.data.assignment]);
      setAnnouncement(`Added "${result.data.assignment.title}".`);
    }
    resetForm();
  }

  function handleEdit(assignment: AssignmentDTO) {
    setEditingId(assignment.id);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(assignment.dueDate);
    setStatus(assignment.status);
    setError("");
    setFieldErrors({});
    document.getElementById("title")?.focus();
  }

  async function handleDelete(assignment: AssignmentDTO) {
    if (!window.confirm(`Delete "${assignment.title}"? This can't be undone.`)) return;

    setBusyId(assignment.id);
    const result = await callApi<null>(`/api/assignments/${assignment.id}`, { method: "DELETE" });
    setBusyId(null);

    if (!result.ok) {
      setAnnouncement(handleFailure(result));
      return;
    }
    setAssignments((current) => current.filter((a) => a.id !== assignment.id));
    if (editingId === assignment.id) resetForm();
    setAnnouncement(`Deleted "${assignment.title}".`);
  }

  async function toggleStatus(assignment: AssignmentDTO) {
    const next: AssignmentStatus = assignment.status === "PENDING" ? "COMPLETED" : "PENDING";
    setBusyId(assignment.id);
    const result = await callApi<{ assignment: AssignmentDTO }>(`/api/assignments/${assignment.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    setBusyId(null);

    if (!result.ok) {
      setAnnouncement(handleFailure(result));
      return;
    }
    replaceAssignment(result.data.assignment);
    setAnnouncement(`Marked "${assignment.title}" as ${STATUS_LABEL[next].toLowerCase()}.`);
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
      hasError ? "border-red-600" : "border-slate-300 focus:border-blue-500"
    }`;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Assignment Management</h1>
        <p className="mt-2 text-slate-600">Organize your assignments and keep track of your deadlines.</p>
      </header>

      {/* Screen readers hear the result of each add, edit, delete or status change. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <section aria-label="Progress" className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Assignments</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{summary.total}</p>
          {summary.overdue > 0 && (
            <p className="mt-1 text-sm font-medium text-red-700">{summary.overdue} overdue</p>
          )}
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-700">{summary.completed}</p>
          <p className="mt-1 text-sm text-slate-500">{summary.pending} pending</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completion Progress</p>
          {summary.percent === null ? (
            <p className="mt-2 text-lg font-semibold text-slate-500">Unavailable</p>
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold text-blue-600">{summary.percent}%</p>
              <div
                className="mt-3 h-2 rounded-full bg-slate-200"
                role="progressbar"
                aria-label="Assignments completed"
                aria-valuenow={summary.percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${summary.percent}%` }} />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-900">
          {editingId !== null ? "Edit Assignment" : "Add New Assignment"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Assignment Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter assignment title"
              maxLength={200}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "title-error" : undefined}
              className={inputClass(Boolean(fieldErrors.title))}
              required
            />
            {fieldErrors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-700">
                {fieldErrors.title.join(" ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter assignment details"
              rows={3}
              maxLength={2000}
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={fieldErrors.description ? "description-error" : undefined}
              className={inputClass(Boolean(fieldErrors.description))}
            />
            {fieldErrors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-700">
                {fieldErrors.description.join(" ")}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-slate-700">
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                aria-invalid={Boolean(fieldErrors.dueDate)}
                aria-describedby={fieldErrors.dueDate ? "dueDate-error" : undefined}
                className={inputClass(Boolean(fieldErrors.dueDate))}
                required
              />
              {fieldErrors.dueDate && (
                <p id="dueDate-error" className="mt-1 text-sm text-red-700">
                  {fieldErrors.dueDate.join(" ")}
                </p>
              )}
            </div>

            {editingId !== null && (
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as AssignmentStatus)}
                  className={inputClass(false)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            )}
          </div>

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
              {busyId === "form" ? "Saving…" : editingId !== null ? "Save Changes" : "Add Assignment"}
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

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-900">My Assignments</h2>

        {sortedAssignments.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No assignments yet. Add your first assignment above.</p>
        ) : (
          <ul className="space-y-4">
            {sortedAssignments.map((assignment) => {
              const overdue = isOverdue(assignment, today);
              const busy = busyId === assignment.id;
              return (
                <li
                  key={assignment.id}
                  className={`rounded-lg border p-5 ${overdue ? "border-red-300 bg-red-50/40" : "border-slate-200"}`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-slate-900">{assignment.title}</h3>

                      <p className="mt-2 break-words text-sm text-slate-600">
                        {assignment.description || "No description provided."}
                      </p>

                      <p className={`mt-3 text-sm ${overdue ? "font-medium text-red-700" : "text-slate-500"}`}>
                        Due: {formatDueDate(assignment.dueDate)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            assignment.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {STATUS_LABEL[assignment.status]}
                        </span>
                        {overdue && (
                          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(assignment)}
                        disabled={busy}
                        aria-label={`${assignment.status === "COMPLETED" ? "Mark pending" : "Mark complete"}: ${assignment.title}`}
                        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60"
                      >
                        {assignment.status === "COMPLETED" ? "Mark Pending" : "Complete"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        disabled={busy}
                        aria-label={`Edit: ${assignment.title}`}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment)}
                        disabled={busy}
                        aria-label={`Delete: ${assignment.title}`}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

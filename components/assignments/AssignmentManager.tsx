
"use client";

import { useState } from "react";

type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "Pending" | "Completed";
};

const sampleAssignments: Assignment[] = [
  {
    id: 1,
    title: "Complete Web Development Assignment",
    description: "Finish the weekly coding assignment.",
    dueDate: "2026-11-20",
    status: "Pending",
  },
  {
    id: 2,
    title: "Read Course Materials",
    description: "Review this week's learning materials.",
    dueDate: "2026-11-18",
    status: "Completed",
  },
];

export default function AssignmentManager() {
  const [assignments, setAssignments] =
    useState<Assignment[]>(sampleAssignments);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const completedCount = assignments.filter(
    (assignment) => assignment.status === "Completed"
  ).length;

  const progress =
    assignments.length === 0
      ? 0
      : Math.round((completedCount / assignments.length) * 100);

  const sortedAssignments = [...assignments].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate)
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !dueDate) {
      setError("Please enter an assignment title and due date.");
      return;
    }

    if (editingId !== null) {
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === editingId
            ? {
                ...assignment,
                title: title.trim(),
                description: description.trim(),
                dueDate,
              }
            : assignment
        )
      );
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
        status: "Pending",
      };

      setAssignments((current) => [...current, newAssignment]);
    }

    resetForm();
  }

  function handleEdit(assignment: Assignment) {
    setEditingId(assignment.id);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(assignment.dueDate);
    setError("");
  }

  function handleDelete(id: number) {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments((current) =>
        current.filter((assignment) => assignment.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    }
  }

  function toggleStatus(id: number) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status:
                assignment.status === "Pending"
                  ? "Completed"
                  : "Pending",
            }
          : assignment
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Assignment Management
          </h1>
          <p className="mt-2 text-slate-600">
            Organize your assignments and keep track of your deadlines.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Assignments</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {assignments.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completion Progress</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {progress}%
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            {editingId !== null ? "Edit Assignment" : "Add New Assignment"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Assignment Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter assignment title"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter assignment details"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                {editingId !== null ? "Save Changes" : "Add Assignment"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            My Assignments
          </h2>

          {sortedAssignments.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No assignments yet. Add your first assignment above.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {assignment.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {assignment.description || "No description provided."}
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        Due: {assignment.dueDate}
                      </p>

                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          assignment.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(assignment.id)}
                        className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                      >
                        {assignment.status === "Completed"
                          ? "Mark Pending"
                          : "Complete"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}


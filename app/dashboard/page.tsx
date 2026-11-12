import type { Metadata } from "next";
import { Suspense } from "react";
import { logoutUser } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard | StudyTrack",
};

// Placeholder dashboard that proves sign-in works. Nsikak's navigation and
// Precious's assignment views will replace the body of this page.
export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      {/* With cacheComponents on, anything that reads the session must sit inside Suspense. */}
      <Suspense fallback={<p className="text-slate-600">Loading your planner…</p>}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  const user = await requireUser();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user.name}</h1>
          <p className="mt-1 text-slate-600">Signed in as {user.email}</p>
        </div>
        <form action={logoutUser}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Log out
          </button>
        </form>
      </div>
      <p className="mt-6 text-slate-700">Your assignments and study sessions will appear here.</p>
    </section>
  );
}

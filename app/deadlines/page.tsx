
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Deadlines",
    description:
        "Track upcoming assignment deadlines, prioritize academic tasks, and stay organized with StudyTrack.",
};

export default function DeadlinesPage() {
    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Assignment Deadlines
                </h1>

                <p className="mt-2 text-slate-600">
                    Stay organized and keep track of your upcoming
                    academic deadlines.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                    Deadline Tracking
                </h2>

                <p className="mt-3 text-slate-600">
                    A dedicated deadline tracking view is coming soon.
                    You will be able to see upcoming assignment deadlines
                    and prioritize your academic responsibilities.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/assignments"
                        className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        View Assignments
                    </Link>

                    <Link
                        href="/dashboard"
                        className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </section>
    );
}

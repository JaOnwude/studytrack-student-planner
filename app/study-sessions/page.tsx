
import Link from "next/link";

export default function StudySessionsPage() {
    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Study Sessions
                </h1>

                <p className="mt-2 text-slate-600">
                    Organize your study time and stay focused on your
                    academic goals.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                    Study Session Planner
                </h2>

                <p className="mt-3 text-slate-600">
                    Study session scheduling and tracking are coming soon.
                    This feature will help you plan study activities and
                    manage your learning time effectively.
                </p>

                <div className="mt-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </section>
    );
}

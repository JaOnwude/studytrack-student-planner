import Link from "next/link";

const FEATURES = [
  {
    title: "Track assignments",
    body: "Add each assignment with its due date, update it as plans change, and mark it complete when it's done.",
  },
  {
    title: "Never miss a deadline",
    body: "See what's due next in date order, with anything overdue clearly flagged.",
  },
  {
    title: "See your progress",
    body: "Know at a glance how many assignments you've finished and how far along you are.",
  },
];

const primaryButton =
  "inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const secondaryButton =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white">
        <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            aria-current="page"
            className="text-xl font-bold tracking-tight text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            StudyTrack
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Log in
            </Link>
            <Link href="/register" className={`${primaryButton} px-4 py-2`}>
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Student planner</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Stay on top of every assignment and deadline.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            StudyTrack keeps your coursework in one place, so you always know what&apos;s due next and how much you&apos;ve
            already finished.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className={primaryButton}>
              Get started, it&apos;s free
            </Link>
            <Link href="/login" className={secondaryButton}>
              I already have an account
            </Link>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 id="features-heading" className="text-2xl font-bold text-slate-900">
              What you can do
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">StudyTrack · WDD 430 Team 02 project</p>
      </footer>
    </div>
  );
}

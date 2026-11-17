import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { UserMenu, UserMenuSkeleton } from "./UserMenu";

function Brand() {
  return (
    <Link
      href="/"
      className="text-xl font-bold tracking-tight text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    >
      StudyTrack
    </Link>
  );
}

// Layout for the signed-in area: a sidebar from 768px up, a top bar with a menu button below that.
export function AppShell({ children }: { children: ReactNode }) {
  const userMenu = (
    <Suspense fallback={<UserMenuSkeleton />}>
      <UserMenu />
    </Suspense>
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 md:flex-row">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Brand />
        <MobileMenu userMenu={userMenu} />
      </header>

      <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-slate-200 bg-white p-6 md:flex">
        <Brand />
        <nav aria-label="Main" className="flex-1">
          <NavLinks />
        </nav>
        {userMenu}
      </aside>

      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}

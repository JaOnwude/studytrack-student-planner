"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages in the signed-in area. Add Study Sessions here when it's built.
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assignments", label: "Assignments" },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

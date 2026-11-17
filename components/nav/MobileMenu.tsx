"use client";

import { useState, type ReactNode } from "react";
import { NavLinks } from "./NavLinks";

// Phone and small-tablet navigation: a menu button that opens the links below the top bar.
export function MobileMenu({ userMenu }: { userMenu: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-20 border-b border-slate-200 bg-white px-4 pb-4 pt-2 shadow-md"
      >
        <NavLinks onNavigate={() => setOpen(false)} />
        <div className="mt-4 border-t border-slate-200 pt-4">{userMenu}</div>
      </nav>
    </>
  );
}

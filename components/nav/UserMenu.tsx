import { logoutUser } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/dal";

// Signed-in student's name and the log out button. Reads the session, so render it
// inside <Suspense>.
export async function UserMenu() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{user.name}</p>
        <p className="truncate text-sm text-slate-600">{user.email}</p>
      </div>
      <form action={logoutUser}>
        <button
          type="submit"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

export function UserMenuSkeleton() {
  return <div className="h-20 animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />;
}

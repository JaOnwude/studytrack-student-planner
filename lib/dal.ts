import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * Returns the signed-in student, or null. Use in API route handlers and
 * respond with 401 when it returns null.
 *
 * Always take the user id from here, never from the request body or URL, and
 * include it in every query, e.g. prisma.assignment.findMany({ where: { userId: user.id } }).
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;
  return { id: user.id, name: user.name ?? "", email: user.email ?? "" };
}

/**
 * Returns the signed-in student, or redirects to /login. Use in Server
 * Components and Server Actions.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 renamed middleware.ts to proxy.ts. This is a quick, cookie-only check
// that redirects signed-out visitors away from private pages. It is not the only
// guard: every server action and API route must still call requireUser() or
// getCurrentUser() from lib/dal.ts.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

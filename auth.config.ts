
import type { NextAuthConfig } from "next-auth";

// Pages that require a signed-in student.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/assignments",
  "/study-sessions",
  "/deadlines",
];

const AUTH_PAGES = ["/login", "/register"];

// Edge-safe settings shared by proxy.ts and auth.ts.
// Keep database code out of this file.
export const authConfig = {
  pages: {
    signIn: "/login",
  },

  // Credentials authentication uses JWT sessions.
  session: { strategy: "jwt" },

  // Required for local production and Vercel hosting.
  trustHost: true,

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = Boolean(auth?.user);
      const path = nextUrl.pathname;

      const isProtectedRoute = PROTECTED_PREFIXES.some(
        (prefix) =>
          path === prefix || path.startsWith(`${prefix}/`)
      );

      if (isProtectedRoute) {
        return isSignedIn;
      }

      if (isSignedIn && AUTH_PAGES.includes(path)) {
        return Response.redirect(
          new URL("/dashboard", nextUrl)
        );
      }

      return true;
    },

    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;

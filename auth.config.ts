import type { NextAuthConfig } from "next-auth";

// Pages that require a signed-in student. Add new private sections here.
const PROTECTED_PREFIXES = ["/dashboard", "/assignments", "/study-sessions"];
const AUTH_PAGES = ["/login", "/register"];

// Edge-safe settings shared by proxy.ts and auth.ts. Keep database code out of this file.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // The Credentials provider requires JWT sessions (stored in an encrypted cookie).
  session: { strategy: "jwt" },
  // Trust the request's Host header (needed for `npm run start` locally; Vercel sets it correctly).
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = Boolean(auth?.user);
      const path = nextUrl.pathname;

      if (PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
        return isSignedIn; // false sends the visitor to /login
      }
      if (isSignedIn && AUTH_PAGES.includes(path)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
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

import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

// Compared against when no account matches, so a wrong email takes as long as a
// wrong password and response times don't reveal which emails are registered.
const TIMING_PLACEHOLDER_HASH = "$2b$12$R/CWfLDgW5G./xIxqEIWa.d1vTTVYjRrbw7ipXs0vepSKJKEuEGru";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        const passwordMatches = await bcrypt.compare(
          password,
          user?.passwordHash ?? TIMING_PLACEHOLDER_HASH,
        );
        if (!user || !passwordMatches) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});

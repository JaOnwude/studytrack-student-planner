"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { loginSchema, registerSchema } from "@/lib/validation";

export type FormState = {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password", string[]>>;
  values?: { name?: string; email?: string };
};

const BCRYPT_COST = 12;

export async function registerUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { name: raw.name, email: raw.email };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const { name, email, password } = parsed.data;
  const emailTaken = { fieldErrors: { email: ["An account with this email already exists."] }, values };

  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return emailTaken;
  }

  try {
    await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, BCRYPT_COST) },
    });
  } catch (error) {
    // Two sign-ups with the same email at the same moment: the unique index wins.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return emailTaken;
    }
    throw error;
  }

  // Sign the new student in straight away. On success signIn throws a redirect.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function loginUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          error.type === "CredentialsSignin"
            ? "Incorrect email or password."
            : "Something went wrong signing you in. Please try again.",
        values,
      };
    }
    throw error; // lets the success redirect through
  }
  return {};
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

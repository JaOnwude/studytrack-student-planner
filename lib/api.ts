import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

// Shared JSON responses for the API routes.

export function unauthorized() {
  return NextResponse.json({ error: "You need to log in." }, { status: 401 });
}

export function notFound(what = "Not found.") {
  return NextResponse.json({ error: what }, { status: 404 });
}

export function validationError(error: z.ZodError) {
  const { formErrors, fieldErrors } = z.flattenError(error);
  return NextResponse.json(
    { error: formErrors[0] ?? "Please fix the highlighted fields.", fieldErrors },
    { status: 400 },
  );
}

/** Reads a JSON body, or returns null when it isn't valid JSON. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function badJson() {
  return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
}

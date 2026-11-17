import { NextResponse } from "next/server";
import { badJson, readJson, unauthorized, validationError } from "@/lib/api";
import { createAssignment, listAssignments } from "@/lib/assignments";
import { getCurrentUser } from "@/lib/dal";
import { assignmentSchema } from "@/lib/validation";

// GET /api/assignments: the signed-in student's assignments, soonest due first.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  return NextResponse.json({ assignments: await listAssignments(user.id) });
}

// POST /api/assignments: create one. Body: { title, description?, dueDate: "YYYY-MM-DD" }
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await readJson(request);
  if (body === null) return badJson();

  const parsed = assignmentSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const assignment = await createAssignment(user.id, parsed.data);
  return NextResponse.json({ assignment }, { status: 201 });
}

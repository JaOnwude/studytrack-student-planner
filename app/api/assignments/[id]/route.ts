import { NextResponse } from "next/server";
import { badJson, notFound, readJson, unauthorized, validationError } from "@/lib/api";
import { deleteAssignment, updateAssignment } from "@/lib/assignments";
import { getCurrentUser } from "@/lib/dal";
import { assignmentUpdateSchema } from "@/lib/validation";

const NOT_FOUND = "Assignment not found.";

// PATCH /api/assignments/:id: change any of title, description, dueDate, status.
export async function PATCH(request: Request, ctx: RouteContext<"/api/assignments/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  const body = await readJson(request);
  if (body === null) return badJson();

  const parsed = assignmentUpdateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Someone else's assignment gets the same 404 as a missing one.
  const assignment = await updateAssignment(user.id, id, parsed.data);
  if (!assignment) return notFound(NOT_FOUND);

  return NextResponse.json({ assignment });
}

// DELETE /api/assignments/:id
export async function DELETE(_request: Request, ctx: RouteContext<"/api/assignments/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  if (!(await deleteAssignment(user.id, id))) return notFound(NOT_FOUND);

  return new NextResponse(null, { status: 204 });
}

import { NextResponse } from "next/server";
import { badJson, notFound, readJson, unauthorized, validationError } from "@/lib/api";
import { getCurrentUser } from "@/lib/dal";
import { deleteStudySession, updateStudySession } from "@/lib/study-sessions";
import { studySessionUpdateSchema } from "@/lib/validation";

const NOT_FOUND = "Study session not found.";

// PATCH /api/study-sessions/:id: change any of topic, scheduledAt, durationMinutes, notes, status.
export async function PATCH(request: Request, ctx: RouteContext<"/api/study-sessions/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  const body = await readJson(request);
  if (body === null) return badJson();

  const parsed = studySessionUpdateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Someone else's session gets the same 404 as a missing one.
  const studySession = await updateStudySession(user.id, id, parsed.data);
  if (!studySession) return notFound(NOT_FOUND);

  return NextResponse.json({ studySession });
}

// DELETE /api/study-sessions/:id
export async function DELETE(_request: Request, ctx: RouteContext<"/api/study-sessions/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  if (!(await deleteStudySession(user.id, id))) return notFound(NOT_FOUND);

  return new NextResponse(null, { status: 204 });
}

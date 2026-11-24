import { NextResponse } from "next/server";
import { badJson, readJson, unauthorized, validationError } from "@/lib/api";
import { getCurrentUser } from "@/lib/dal";
import { createStudySession, listStudySessions } from "@/lib/study-sessions";
import { studySessionSchema } from "@/lib/validation";

// GET /api/study-sessions: the signed-in student's study sessions, earliest first.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  return NextResponse.json({ studySessions: await listStudySessions(user.id) });
}

// POST /api/study-sessions: create one.
// Body: { topic, scheduledAt: ISO 8601 date-time, durationMinutes, notes? }
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await readJson(request);
  if (body === null) return badJson();

  const parsed = studySessionSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const studySession = await createStudySession(user.id, parsed.data);
  return NextResponse.json({ studySession }, { status: 201 });
}

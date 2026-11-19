import "server-only";
import type { StudySession as StudySessionRow } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { StudySessionInput, StudySessionUpdate } from "@/lib/validation";

export type StudySessionStatus = "PLANNED" | "COMPLETED" | "CANCELLED";

// What the browser receives. scheduledAt is an ISO 8601 moment in UTC; the browser
// shows it in the student's own time zone.
export type StudySessionDTO = {
  id: string;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  notes: string;
  status: StudySessionStatus;
};

function toDTO(row: StudySessionRow): StudySessionDTO {
  return {
    id: row.id,
    topic: row.topic,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    notes: row.notes ?? "",
    status: row.status,
  };
}

// Every function takes the signed-in student's id (from lib/dal.ts) and includes it in
// the query, so a student can only ever read or change their own study sessions.

export async function listStudySessions(userId: string): Promise<StudySessionDTO[]> {
  const rows = await prisma.studySession.findMany({
    where: { userId },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDTO);
}

export async function createStudySession(userId: string, input: StudySessionInput): Promise<StudySessionDTO> {
  const row = await prisma.studySession.create({
    data: {
      userId,
      topic: input.topic,
      scheduledAt: new Date(input.scheduledAt),
      durationMinutes: input.durationMinutes,
      notes: input.notes || null,
      status: input.status ?? "PLANNED",
    },
  });
  return toDTO(row);
}

/** Returns null when the session doesn't exist or belongs to someone else. */
export async function updateStudySession(
  userId: string,
  id: string,
  changes: StudySessionUpdate,
): Promise<StudySessionDTO | null> {
  const { count } = await prisma.studySession.updateMany({
    where: { id, userId },
    data: {
      ...(changes.topic !== undefined && { topic: changes.topic }),
      ...(changes.scheduledAt !== undefined && { scheduledAt: new Date(changes.scheduledAt) }),
      ...(changes.durationMinutes !== undefined && { durationMinutes: changes.durationMinutes }),
      ...(changes.notes !== undefined && { notes: changes.notes || null }),
      ...(changes.status !== undefined && { status: changes.status }),
    },
  });
  if (count === 0) return null;
  const row = await prisma.studySession.findFirst({ where: { id, userId } });
  return row ? toDTO(row) : null;
}

/** Returns false when the session doesn't exist or belongs to someone else. */
export async function deleteStudySession(userId: string, id: string): Promise<boolean> {
  const { count } = await prisma.studySession.deleteMany({ where: { id, userId } });
  return count > 0;
}

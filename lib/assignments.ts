import "server-only";
import type { Assignment as AssignmentRow } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { AssignmentInput, AssignmentUpdate } from "@/lib/validation";

// What the browser receives. Dates are plain "YYYY-MM-DD" strings, because a due date
// is a calendar day, not a moment in time.
export type AssignmentDTO = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "COMPLETED";
};

// Due dates are stored as midnight UTC on that day, so they read back as the same day
// for every student whatever their time zone.
function toDbDate(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function toDTO(row: AssignmentRow): AssignmentDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    dueDate: row.dueDate.toISOString().slice(0, 10),
    status: row.status,
  };
}

// Every function takes the signed-in student's id (from lib/dal.ts) and includes it in
// the query, so a student can only ever read or change their own assignments.

export async function listAssignments(userId: string): Promise<AssignmentDTO[]> {
  const rows = await prisma.assignment.findMany({
    where: { userId },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDTO);
}

export async function createAssignment(userId: string, input: AssignmentInput): Promise<AssignmentDTO> {
  const row = await prisma.assignment.create({
    data: {
      userId,
      title: input.title,
      description: input.description || null,
      dueDate: toDbDate(input.dueDate),
      status: input.status ?? "PENDING",
    },
  });
  return toDTO(row);
}

/** Returns null when the assignment doesn't exist or belongs to someone else. */
export async function updateAssignment(
  userId: string,
  id: string,
  changes: AssignmentUpdate,
): Promise<AssignmentDTO | null> {
  const { count } = await prisma.assignment.updateMany({
    where: { id, userId },
    data: {
      ...(changes.title !== undefined && { title: changes.title }),
      ...(changes.description !== undefined && { description: changes.description || null }),
      ...(changes.dueDate !== undefined && { dueDate: toDbDate(changes.dueDate) }),
      ...(changes.status !== undefined && { status: changes.status }),
    },
  });
  if (count === 0) return null;
  const row = await prisma.assignment.findFirst({ where: { id, userId } });
  return row ? toDTO(row) : null;
}

/** Returns false when the assignment doesn't exist or belongs to someone else. */
export async function deleteAssignment(userId: string, id: string): Promise<boolean> {
  const { count } = await prisma.assignment.deleteMany({ where: { id, userId } });
  return count > 0;
}

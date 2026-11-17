import { NextResponse } from "next/server";

// GET /api/hello: a simple check that the API is running (Issue #2).
export function GET() {
  return NextResponse.json({ message: "Hello from the StudyTrack API!" });
}

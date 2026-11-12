-- Block Supabase's auto-generated Data API (PostgREST) from reading or writing these
-- tables. StudyTrack only reaches the database through Prisma, which connects as the
-- table owner and is not affected by row-level security.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "study_sessions" ENABLE ROW LEVEL SECURITY;

import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI commands (migrate, studio) use DIRECT_URL: Supabase's session
// pooler on port 5432. The running app uses DATABASE_URL instead (see lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});

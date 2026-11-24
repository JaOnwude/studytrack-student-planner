import type { Metadata } from "next";

export const SITE_NAME = "StudyTrack";
export const SITE_DESCRIPTION =
  "A student planner for managing assignments, deadlines, study sessions, and progress.";

// The site's full address, used to turn relative links (such as the Open Graph image)
// into absolute URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL; locally we fall back to localhost.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT ?? 3000}`;

// Signed-in pages show one student's own data, so search engines should not index them.
export const privateSectionMetadata: Metadata = {
  robots: { index: false, follow: false },
};

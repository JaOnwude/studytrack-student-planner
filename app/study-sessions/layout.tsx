import { AppShell } from "@/components/nav/AppShell";
import { privateSectionMetadata } from "@/lib/metadata";

export const metadata = privateSectionMetadata;

export default function Layout({ children }: LayoutProps<"/study-sessions">) {
  return <AppShell>{children}</AppShell>;
}

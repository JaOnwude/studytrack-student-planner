import { AppShell } from "@/components/nav/AppShell";

export default function Layout({ children }: LayoutProps<"/dashboard">) {
  return <AppShell>{children}</AppShell>;
}

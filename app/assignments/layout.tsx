import { AppShell } from "@/components/nav/AppShell";

export default function Layout({ children }: LayoutProps<"/assignments">) {
  return <AppShell>{children}</AppShell>;
}

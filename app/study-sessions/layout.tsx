
import { AppShell } from "@/components/nav/AppShell";

export default function Layout({
    children,
}: LayoutProps<"/study-sessions">) {
    return <AppShell>{children}</AppShell>;
}

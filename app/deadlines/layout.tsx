
import { AppShell } from "@/components/nav/AppShell";

export default function Layout({
    children,
}: LayoutProps<"/deadlines">) {
    return <AppShell>{children}</AppShell>;
}

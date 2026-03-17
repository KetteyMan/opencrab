import { AppShell } from "@/components/app-shell/app-shell";
import { OpenCrabProvider } from "@/components/app-shell/opencrab-provider";
import { SidebarContent } from "@/components/sidebar/sidebar-content";
import { ensureBrowserSessionWarmup } from "@/lib/codex/browser-session";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  void ensureBrowserSessionWarmup();

  return (
    <OpenCrabProvider>
      <AppShell sidebar={<SidebarContent />}>{children}</AppShell>
    </OpenCrabProvider>
  );
}

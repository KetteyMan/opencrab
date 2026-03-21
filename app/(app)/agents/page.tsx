import { AgentsScreen } from "@/components/agents/agents-screen";
import { AppPage } from "@/components/ui/app-page";

export default function AgentsPage() {
  return (
    <AppPage width="wide" contentClassName="space-y-8">
      <AgentsScreen />
    </AppPage>
  );
}

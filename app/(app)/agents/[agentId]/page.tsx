import { AgentDetailScreen } from "@/components/agents/agent-detail-screen";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;

  return <AgentDetailScreen agentId={agentId} />;
}

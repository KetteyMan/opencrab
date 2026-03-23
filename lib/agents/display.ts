import type { AgentProfileRecord } from "@/lib/agents/types";
import { isBuiltInSystemAgentId } from "@/lib/agents/system-agent-metadata";

export function isSystemAgentForDisplay(agent: Pick<AgentProfileRecord, "id" | "source">) {
  return agent.source === "system" || isBuiltInSystemAgentId(agent.id);
}

export function isCustomAgentForDisplay(agent: Pick<AgentProfileRecord, "id" | "source">) {
  return agent.source === "custom" && !isBuiltInSystemAgentId(agent.id);
}

export function isSelectableTeamAgent(
  agent: Pick<AgentProfileRecord, "id" | "availability">,
) {
  if (agent.id === "project-manager") {
    return false;
  }

  return agent.availability === "team" || agent.availability === "both";
}

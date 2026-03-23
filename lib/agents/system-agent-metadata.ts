import type { AgentTeamRole } from "@/lib/agents/types";
import type { CodexSandboxMode } from "@/lib/resources/opencrab-api-types";

type BuiltInSystemAgentDefaults = {
  teamRole: AgentTeamRole;
  defaultSandboxMode: CodexSandboxMode;
};

const BUILT_IN_SYSTEM_AGENT_DEFAULTS: Record<string, BuiltInSystemAgentDefaults> = {
  "project-manager": {
    teamRole: "lead",
    defaultSandboxMode: "workspace-write",
  },
  "user-researcher": {
    teamRole: "research",
    defaultSandboxMode: "workspace-write",
  },
  "aesthetic-designer": {
    teamRole: "specialist",
    defaultSandboxMode: "workspace-write",
  },
  "agent-5567fae0-173c-4b15-8d64-db83ffb058ab": {
    teamRole: "specialist",
    defaultSandboxMode: "workspace-write",
  },
  "agent-6e418784-be7c-4e6f-9d4e-3b55806f08f0": {
    teamRole: "specialist",
    defaultSandboxMode: "workspace-write",
  },
  "agent-7b89ec55-53d2-47c7-affd-58e672d1b226": {
    teamRole: "specialist",
    defaultSandboxMode: "workspace-write",
  },
};

export const PROMOTED_SYSTEM_AGENT_IDS = new Set([
  "agent-5567fae0-173c-4b15-8d64-db83ffb058ab",
  "agent-6e418784-be7c-4e6f-9d4e-3b55806f08f0",
  "agent-7b89ec55-53d2-47c7-affd-58e672d1b226",
]);

export function isBuiltInSystemAgentId(agentId: string) {
  return agentId in BUILT_IN_SYSTEM_AGENT_DEFAULTS;
}

export function getBuiltInSystemAgentDefaults(agentId: string) {
  return BUILT_IN_SYSTEM_AGENT_DEFAULTS[agentId] ?? null;
}

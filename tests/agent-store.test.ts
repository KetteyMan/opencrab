import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type AgentStoreModule = Awaited<typeof import("@/lib/agents/agent-store")>;

async function loadAgentStore(): Promise<AgentStoreModule> {
  vi.resetModules();
  return import("@/lib/agents/agent-store");
}

describe("agent store system defaults", () => {
  const originalOpencrabHome = process.env.OPENCRAB_HOME;
  const tempHomes: string[] = [];

  beforeEach(() => {
    tempHomes.length = 0;
  });

  afterEach(() => {
    if (originalOpencrabHome === undefined) {
      delete process.env.OPENCRAB_HOME;
    } else {
      process.env.OPENCRAB_HOME = originalOpencrabHome;
    }

    tempHomes.forEach((homePath) => {
      rmSync(homePath, { recursive: true, force: true });
    });
  });

  it("uses workspace-write as the default sandbox for all system agents", async () => {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), "opencrab-agent-store-"));
    tempHomes.push(tempHome);
    process.env.OPENCRAB_HOME = tempHome;

    const agentStore = await loadAgentStore();
    const systemAgents = agentStore.listAgentProfiles().filter((agent) => agent.source === "system");

    expect(systemAgents).toHaveLength(3);
    expect(systemAgents.every((agent) => agent.defaultSandboxMode === "workspace-write")).toBe(true);

    const systemTeamRoles = new Map(systemAgents.map((agent) => [agent.id, agent.teamRole] as const));

    expect(systemTeamRoles.get("project-manager")).toBe("lead");
    expect(systemTeamRoles.get("user-researcher")).toBe("research");
    expect(systemTeamRoles.get("aesthetic-designer")).toBe("specialist");
  });

  it("removes deprecated system agents from local storage during startup", async () => {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), "opencrab-agent-store-"));
    const agentDir = path.join(tempHome, "agents", "product-strategist");
    tempHomes.push(tempHome);
    process.env.OPENCRAB_HOME = tempHome;

    mkdirSync(agentDir, { recursive: true });
    writeFileSync(
      path.join(agentDir, "profile.json"),
      JSON.stringify(
        {
          id: "product-strategist",
          name: "产品策略师",
          summary: "旧数据",
          roleLabel: "Strategy",
          description: "旧数据",
          source: "system",
          availability: "both",
          teamRole: "lead",
          defaultModel: null,
          defaultReasoningEffort: null,
          defaultSandboxMode: null,
          starterPrompts: [],
          createdAt: "2026-03-24T00:00:00.000Z",
          updatedAt: "2026-03-24T00:00:00.000Z",
          files: {
            soul: "",
            responsibility: "",
            tools: "",
            user: "",
            knowledge: "",
          },
        },
        null,
        2,
      ),
      "utf8",
    );

    const agentStore = await loadAgentStore();
    const strategist = agentStore.getAgentProfile("product-strategist");

    expect(strategist).toBeNull();
    expect(agentStore.listAgentProfiles().some((agent) => agent.id === "product-strategist")).toBe(false);
  });

  it("normalizes legacy built-in agent profiles to the enforced team role and sandbox", async () => {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), "opencrab-agent-store-"));
    const userResearcherDir = path.join(tempHome, "agents", "user-researcher");
    const promotedAgentDir = path.join(
      tempHome,
      "agents",
      "agent-7b89ec55-53d2-47c7-affd-58e672d1b226",
    );
    tempHomes.push(tempHome);
    process.env.OPENCRAB_HOME = tempHome;

    mkdirSync(userResearcherDir, { recursive: true });
    writeFileSync(
      path.join(userResearcherDir, "profile.json"),
      JSON.stringify(
        {
          id: "user-researcher",
          name: "UX-寡姐",
          summary: "旧数据",
          roleLabel: "UX Research",
          description: "旧数据",
          source: "system",
          availability: "both",
          teamRole: "lead",
          defaultModel: "gpt-5.4",
          defaultReasoningEffort: "high",
          defaultSandboxMode: "read-only",
          starterPrompts: [],
          createdAt: "2026-03-24T00:00:00.000Z",
          updatedAt: "2026-03-24T00:00:00.000Z",
          files: {
            soul: "",
            responsibility: "",
            tools: "",
            user: "",
            knowledge: "",
          },
        },
        null,
        2,
      ),
      "utf8",
    );

    mkdirSync(promotedAgentDir, { recursive: true });
    writeFileSync(
      path.join(promotedAgentDir, "profile.json"),
      JSON.stringify(
        {
          id: "agent-7b89ec55-53d2-47c7-affd-58e672d1b226",
          name: "DEV-钢铁侠",
          summary: "旧数据",
          roleLabel: "Expert",
          description: "旧数据",
          source: "custom",
          availability: "both",
          teamRole: "lead",
          defaultModel: "gpt-5.4",
          defaultReasoningEffort: "high",
          defaultSandboxMode: "danger-full-access",
          starterPrompts: [],
          createdAt: "2026-03-24T00:00:00.000Z",
          updatedAt: "2026-03-24T00:00:00.000Z",
          files: {
            soul: "",
            responsibility: "",
            tools: "",
            user: "",
            knowledge: "",
          },
        },
        null,
        2,
      ),
      "utf8",
    );

    const agentStore = await loadAgentStore();
    const researcher = agentStore.getAgentProfile("user-researcher");
    const promoted = agentStore.getAgentProfile("agent-7b89ec55-53d2-47c7-affd-58e672d1b226");

    expect(researcher?.source).toBe("system");
    expect(researcher?.teamRole).toBe("research");
    expect(researcher?.defaultModel).toBeNull();
    expect(researcher?.defaultReasoningEffort).toBeNull();
    expect(researcher?.defaultSandboxMode).toBe("workspace-write");

    expect(promoted?.source).toBe("system");
    expect(promoted?.teamRole).toBe("specialist");
    expect(promoted?.defaultModel).toBeNull();
    expect(promoted?.defaultReasoningEffort).toBeNull();
    expect(promoted?.defaultSandboxMode).toBe("workspace-write");
  });
});

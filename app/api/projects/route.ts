import { createProject, createProjectFromConversation, listProjects } from "@/lib/projects/project-store";
import { errorResponse, json, readJsonBody } from "@/lib/server/api-route";

export async function GET() {
  return json({
    projects: listProjects(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<{
      conversationId?: string;
      goal?: string;
      workspaceDir?: string;
      agentProfileIds?: string[];
    }>(request, {});

    if (body.conversationId) {
      const detail = createProjectFromConversation(body.conversationId);
      return json(detail);
    }

    if (!body.goal) {
      throw new Error("请先填写团队目标。");
    }

    const detail = createProject({
      goal: body.goal,
      workspaceDir: body.workspaceDir || "",
      agentProfileIds: Array.isArray(body.agentProfileIds) ? body.agentProfileIds : [],
    });

    return json(detail);
  } catch (error) {
    return errorResponse(error, "创建团队模式失败。", 400);
  }
}

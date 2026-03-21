import { replyToProjectConversation } from "@/lib/projects/project-store";
import {
  errorResponse,
  json,
  readJsonBody,
  readRouteParams,
  type RouteContext,
} from "@/lib/server/api-route";

export async function POST(
  request: Request,
  context: RouteContext<{ projectId: string }>,
) {
  try {
    const { projectId } = await readRouteParams(context);
    const body = await readJsonBody<{
      conversationId?: string;
      content?: string;
    }>(request, {});

    const snapshot = await replyToProjectConversation({
      projectId,
      conversationId: body.conversationId || "",
      content: body.content || "",
    });

    return json({ snapshot });
  } catch (error) {
    return errorResponse(error, "团队群聊回复失败。", 400);
  }
}

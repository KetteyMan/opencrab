import { createConversation } from "@/lib/resources/local-store";
import { json, readJsonBody } from "@/lib/server/api-route";

export async function POST(request: Request) {
  const body = await readJsonBody<{
    title?: string;
    folderId?: string | null;
    projectId?: string | null;
    agentProfileId?: string | null;
  }>(
    request,
    {},
  );
  const result = createConversation({
    title: body.title,
    folderId: body.folderId ?? null,
    projectId: body.projectId ?? null,
    agentProfileId: body.agentProfileId ?? null,
  });

  return json(result);
}

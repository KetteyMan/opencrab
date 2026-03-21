import { deleteProject, getProjectDetail, runProject, updateProjectCheckpoint } from "@/lib/projects/project-store";
import {
  errorResponse,
  json,
  notFoundJson,
  readJsonBody,
  readRouteParams,
  type RouteContext,
} from "@/lib/server/api-route";
import type { ProjectCheckpointAction } from "@/lib/projects/types";

export async function GET(
  _request: Request,
  context: RouteContext<{ projectId: string }>,
) {
  const { projectId } = await readRouteParams(context);
  const detail = getProjectDetail(projectId);

  if (!detail) {
    return notFoundJson("这个团队模式不存在，可能已经被删除。");
  }

  return json(detail);
}

export async function POST(
  _request: Request,
  context: RouteContext<{ projectId: string }>,
) {
  try {
    const { projectId } = await readRouteParams(context);
    const detail = await runProject(projectId);

    if (!detail) {
      return notFoundJson("这个团队模式不存在，可能已经被删除。");
    }

    return json(detail);
  } catch (error) {
    return errorResponse(error, "启动团队运行失败。", 400);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<{ projectId: string }>,
) {
  try {
    const { projectId } = await readRouteParams(context);
    const body = await readJsonBody<{
      action: ProjectCheckpointAction;
      note?: string | null;
    }>(request);
    const detail = await updateProjectCheckpoint(projectId, body);

    if (!detail) {
      return notFoundJson("这个团队模式不存在，可能已经被删除。");
    }

    return json(detail);
  } catch (error) {
    return errorResponse(error, "更新团队检查点失败。", 400);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<{ projectId: string }>,
) {
  try {
    const { projectId } = await readRouteParams(context);
    const ok = deleteProject(projectId);

    if (!ok) {
      return notFoundJson("这个团队模式不存在，可能已经被删除。");
    }

    return json({ ok: true });
  } catch (error) {
    return errorResponse(error, "删除团队失败。", 400);
  }
}

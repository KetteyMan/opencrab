"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Composer, type ComposerMentionOption } from "@/components/composer/composer";
import { useOpenCrabApp } from "@/components/app-shell/opencrab-provider";
import { ConversationThread } from "@/components/conversation/conversation-thread";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import {
  DialogActions,
  DialogHeader,
  DialogPrimaryButton,
  DialogSecondaryButton,
  DialogShell,
} from "@/components/ui/dialog";
import {
  formatBrowserSessionLabel,
  formatReasoningEffortLabel,
  formatSandboxModeLabel,
} from "@/lib/opencrab/labels";
import { usePersistedDraft } from "@/lib/opencrab/use-persisted-draft";
import {
  createProjectFromConversation,
  createTask,
  getProjectDetail as getProjectDetailResource,
} from "@/lib/resources/opencrab-api";
import type { TaskSchedule, UploadedAttachment } from "@/lib/resources/opencrab-api-types";
import type { ConversationItem } from "@/lib/seed-data";

type ConversationDetailScreenProps = {
  conversationId: string;
};

const TEAM_CONVERSATION_SYNC_INTERVAL_MS = 8_000;

export function ConversationDetailScreen({ conversationId }: ConversationDetailScreenProps) {
  const router = useRouter();
  const {
    conversations,
    conversationMessages,
    agents,
    codexModels,
    codexStatus,
    browserSessionStatus,
    selectedModel,
    selectedReasoningEffort,
    selectedSandboxMode,
    isConversationStreaming,
    setSelectedModel,
    setSelectedReasoningEffort,
    isHydrated,
    isUploadingAttachments,
    stopMessage,
    errorMessage,
    refreshSnapshot,
    sendMessage,
    setConversationAgentProfile,
    uploadAttachments,
  } = useOpenCrabApp();
  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === conversationId),
    [conversationId, conversations],
  );
  const { draft, setDraft, clearDraft } = usePersistedDraft(
    `opencrab:draft:conversation:${conversationId}`,
  );
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskMessage, setTaskMessage] = useState<string | null>(null);
  const [taskMessageTone, setTaskMessageTone] = useState<"default" | "success" | "error">(
    "default",
  );
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState<string | null>(null);
  const [isAgentDialogVisible, setIsAgentDialogVisible] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [isBindingAgent, setIsBindingAgent] = useState(false);
  const [teamMentionOptions, setTeamMentionOptions] = useState<ComposerMentionOption[]>([]);
  const isCurrentConversationSending = isConversationStreaming(conversationId);
  const hasConversationMessages = Boolean(conversationMessages[conversationId]);
  const latestUserMessage = useMemo(
    () =>
      [...(conversationMessages[conversationId] ?? [])]
        .reverse()
        .find((message) => message.role === "user"),
    [conversationId, conversationMessages],
  );
  const taskSeed = useMemo(
    () => ({
      name: buildTaskName(activeConversation?.title || "新定时任务"),
      prompt: latestUserMessage?.content?.trim() || activeConversation?.title || "",
      schedule: {
        preset: "daily" as const,
        time: "09:00",
      },
    }),
    [activeConversation?.title, latestUserMessage?.content],
  );
  const activeAgent = useMemo(
    () => agents.find((item) => item.id === activeConversation?.agentProfileId) || null,
    [activeConversation?.agentProfileId, agents],
  );
  const conversationMode = useMemo(
    () => (activeConversation ? resolveConversationMode(activeConversation) : "default"),
    [activeConversation],
  );
  const mentionOptions = conversationMode === "team" ? teamMentionOptions : [];

  useEffect(() => {
    if (!activeConversation?.projectId) {
      setTeamMentionOptions([]);
      return;
    }

    let cancelled = false;

    void getProjectDetailResource(activeConversation.projectId)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        setTeamMentionOptions(
          detail.agents.map((agent) => ({
            id: agent.id,
            label: agent.name,
            description: agent.role,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setTeamMentionOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeConversation?.projectId]);

  useEffect(() => {
    if (conversationMode !== "team") {
      return;
    }

    let cancelled = false;

    const intervalId = window.setInterval(() => {
      if (
        cancelled ||
        document.visibilityState !== "visible" ||
        isCurrentConversationSending ||
        isInteractiveInputFocused()
      ) {
        return;
      }

      void refreshSnapshot().catch(() => {
        // Keep team runtime polling quiet; the page already shows the last good state.
      });
    }, TEAM_CONVERSATION_SYNC_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [conversationMode, isCurrentConversationSending, refreshSnapshot]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center lg:h-full lg:min-h-0">
        <p className="text-[14px] text-muted-strong">正在加载对话...</p>
      </div>
    );
  }

  if (!activeConversation) {
    if (hasConversationMessages || isCurrentConversationSending) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 text-center lg:h-full lg:min-h-0">
          <p className="text-[14px] text-muted-strong">正在准备对话...</p>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center lg:h-full lg:min-h-0">
        <div className="space-y-3">
          <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-text">这个对话已经不存在了</h1>
          <p className="text-[14px] text-muted-strong">可以从左侧选择其他对话，或点击“新对话”重新开始。</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(input: { content: string; attachments: UploadedAttachment[] }) {
    const nextConversationId = await sendMessage({ conversationId, ...input });

    if (!nextConversationId) {
      return false;
    }

    clearDraft();
    return true;
  }

  async function handleCreateTask(input: {
    name: string;
    prompt: string;
    timezone: string | null;
    schedule: TaskSchedule;
  }) {
    setIsCreatingTask(true);
    setTaskMessage(null);
    setCreatedTaskId(null);

    try {
      const response = await createTask({
        ...input,
        conversationId,
      });

      if (!response.task) {
        throw new Error("创建定时任务失败。");
      }

      setTaskMessageTone("success");
      setTaskMessage("定时任务已创建。以后它会按计划继续在这条对话里执行。");
      setCreatedTaskId(response.task.id);
      setIsTaskFormVisible(false);
      router.refresh();
    } catch (error) {
      setTaskMessageTone("error");
      setTaskMessage(error instanceof Error ? error.message : "创建定时任务失败。");
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleCreateProjectMode() {
    setIsCreatingProject(true);
    setProjectMessage(null);

    try {
      const response = await createProjectFromConversation(conversationId);

      if (!response.project) {
        throw new Error("创建团队模式失败。");
      }

      router.push(`/projects/${response.project.id}`);
      router.refresh();
    } catch (error) {
      setProjectMessage(error instanceof Error ? error.message : "创建团队模式失败。");
    } finally {
      setIsCreatingProject(false);
    }
  }

  async function handleBindAgent() {
    setIsBindingAgent(true);

    try {
      await setConversationAgentProfile(conversationId, selectedAgentId || null);
      setIsAgentDialogVisible(false);
    } catch {
      // Shared provider error state already covers this.
    } finally {
      setIsBindingAgent(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:h-full lg:min-h-0">
      <div className="shrink-0 border-b border-line bg-background px-6 py-5 lg:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-text">
            {activeConversation.title}
          </h1>
          {conversationMode === "channel" || conversationMode === "task" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-strong">
              <span className="rounded-full border border-line bg-surface px-3 py-1.5">
                {getConversationModeLabel(conversationMode, activeConversation.source)}
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5">
                {activeConversation.source === "task"
                  ? activeConversation.remoteUserLabel || activeConversation.title
                  : activeConversation.remoteUserLabel ||
                    activeConversation.remoteChatLabel ||
                    "远程会话"}
              </span>
            </div>
          ) : null}
          {conversationMode === "team" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-strong">
              <span className="rounded-full border border-[#d7e4ff] bg-[#eef4ff] px-3 py-1.5 text-[#2d56a3]">
                团队群聊
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5">
                这里会展示不同 Agent 的协作过程
              </span>
              <Link
                href={`/projects/${activeConversation.projectId}`}
                className="rounded-full border border-line bg-surface px-3 py-1.5 transition hover:bg-surface-muted"
              >
                返回 Team Room
              </Link>
            </div>
          ) : null}
          {conversationMode === "agent" && activeAgent ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-strong">
              <span className="rounded-full border border-[#f2dcc0] bg-[#fff7ec] px-3 py-1.5 text-[#a05a12]">
                智能体单聊
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5">
                {activeAgent.name}
              </span>
              <span className="rounded-full border border-line bg-surface px-3 py-1.5">
                {activeAgent.roleLabel}
              </span>
              <Link
                href={`/agents/${activeAgent.id}`}
                className="rounded-full border border-line bg-surface px-3 py-1.5 transition hover:bg-surface-muted"
              >
                查看智能体配置
              </Link>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {conversationMode !== "team" ? (
              <Button
                onClick={() => {
                  setSelectedAgentId(activeConversation.agentProfileId || "");
                  setIsAgentDialogVisible(true);
                }}
                variant="secondary"
                size="sm"
              >
                {activeAgent ? "更换智能体" : "绑定智能体"}
              </Button>
            ) : null}
            {conversationMode === "default" || conversationMode === "agent" ? (
              <Button
                onClick={() => void handleCreateProjectMode()}
                variant="secondary"
                size="sm"
                disabled={isCreatingProject}
              >
                {isCreatingProject ? "正在升级为团队模式..." : "升级为团队模式"}
              </Button>
            ) : null}
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1.5 text-[12px] text-muted-strong">
              先把产品交互和团队房间做顺，再继续接入真实运行时
            </span>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ConversationThread conversationId={conversationId} />
      </div>
      <div className="shrink-0 border-t border-line bg-background px-4 py-4 lg:px-6">
        <div className="mx-auto w-full max-w-[1180px] space-y-3">
          {isCurrentConversationSending ? (
            <p className="text-[13px] text-muted-strong">OpenCrab 正在整理回复...</p>
          ) : null}
          <div className="flex flex-wrap gap-2 text-[12px] text-muted-strong">
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1.5">
              当前发送权限：{formatSandboxModeLabel(selectedSandboxMode)}
            </span>
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1.5">
              当前发送模型：{selectedModel}
            </span>
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1.5">
              当前推理强度：{formatReasoningEffortLabel(selectedReasoningEffort)}
            </span>
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1.5">
              浏览器连接：{formatBrowserSessionLabel(browserSessionStatus)}
            </span>
            <Button
              onClick={() => {
                setTaskMessage(null);
                setCreatedTaskId(null);
                setIsTaskFormVisible((current) => !current);
              }}
              variant="secondary"
              size="sm"
            >
              {isTaskFormVisible ? "收起定时任务" : "设为定时任务"}
            </Button>
          </div>
          {codexStatus?.ok === false ? (
            <p className="text-[13px] text-[#a34942]">
              先连接 ChatGPT，OpenCrab 才能继续发送和回复这条对话。
            </p>
          ) : null}
          {taskMessage ? (
            <p
              className={`rounded-[16px] border px-4 py-3 text-[13px] ${
                taskMessageTone === "success"
                  ? "border-[#cfe7d4] bg-[#eef8f0] text-[#23633a]"
                  : taskMessageTone === "error"
                    ? "border-[#f3d0cb] bg-[#fff3f1] text-[#b42318]"
                    : "border-line bg-background text-muted-strong"
              }`}
            >
              {taskMessage}
              {createdTaskId ? (
                <>
                  {" "}
                  <Link href={`/tasks/${createdTaskId}`} className="font-medium underline underline-offset-4">
                    查看定时任务
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}
          {projectMessage ? (
            <p className="rounded-[16px] border border-[#f3d0cb] bg-[#fff3f1] px-4 py-3 text-[13px] text-[#b42318]">
              {projectMessage}
            </p>
          ) : null}
          {errorMessage ? <p className="text-[13px] text-[#a34942]">{errorMessage}</p> : null}
          {isTaskFormVisible ? (
            <TaskForm
              key={`${conversationId}:${latestUserMessage?.id ?? "empty"}`}
              title="创建定时任务"
              description="把当前对话里的这类工作交给 OpenCrab 定时处理。结果会继续回到这条对话。"
              initialValue={taskSeed}
              submitLabel="创建定时任务"
              isSubmitting={isCreatingTask}
              onSubmit={handleCreateTask}
            />
          ) : null}
          <Composer
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            onStop={() => stopMessage(conversationId)}
            onUploadFiles={uploadAttachments}
            canSubmit={codexModels.length > 0 && codexStatus?.ok !== false}
            disableOptionSelects={codexModels.length === 0}
            isUploading={isUploadingAttachments}
            isStreaming={isCurrentConversationSending}
            submitLabel={isCurrentConversationSending ? "停止回复" : "发送"}
            modelOptions={codexModels}
            selectedModel={selectedModel}
              selectedReasoningEffort={selectedReasoningEffort}
              onModelChange={setSelectedModel}
              onReasoningEffortChange={setSelectedReasoningEffort}
              mentionOptions={mentionOptions}
            />
          </div>
        </div>

      {isAgentDialogVisible ? (
        <DialogShell onClose={() => (isBindingAgent ? null : setIsAgentDialogVisible(false))}>
          <DialogHeader
            title="绑定智能体"
            description="绑定后，这条对话的每轮回复都会注入该智能体的 soul、职责、工具偏好和长期上下文。"
          />

          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-[13px] font-medium text-text">选择智能体</span>
              <select
                value={selectedAgentId}
                onChange={(event) => setSelectedAgentId(event.target.value)}
                className="w-full rounded-[18px] border border-line bg-surface px-4 py-3 text-[14px] text-text outline-none transition focus:border-[#1f4fd1]"
              >
                <option value="">不绑定，保持普通对话</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} · {agent.roleLabel}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[18px] border border-line bg-surface-muted px-4 py-4 text-[13px] leading-6 text-muted-strong">
              {selectedAgentId
                ? agents.find((agent) => agent.id === selectedAgentId)?.summary ||
                  "这个智能体会作为当前对话的预设角色运行。"
                : "如果不绑定，对话会继续使用默认 OpenCrab 助手模式。"}
            </div>
          </div>

          <DialogActions>
            <DialogSecondaryButton onClick={() => setIsAgentDialogVisible(false)} disabled={isBindingAgent}>
              取消
            </DialogSecondaryButton>
            <DialogPrimaryButton onClick={() => void handleBindAgent()} disabled={isBindingAgent}>
              {isBindingAgent ? "保存中..." : "确认绑定"}
            </DialogPrimaryButton>
          </DialogActions>
        </DialogShell>
      ) : null}
    </div>
  );
}

function resolveConversationMode(conversation: ConversationItem) {
  if (conversation.projectId) {
    return "team" as const;
  }

  if (conversation.source === "telegram" || conversation.source === "feishu") {
    return "channel" as const;
  }

  if (conversation.source === "task") {
    return "task" as const;
  }

  if (conversation.agentProfileId) {
    return "agent" as const;
  }

  return "default" as const;
}

function getConversationModeLabel(
  mode: "channel" | "task",
  source: "telegram" | "feishu" | "task" | "local" | null | undefined,
) {
  if (mode === "task") {
    return "定时任务对话";
  }

  if (source === "telegram") {
    return "Telegram 对话";
  }

  return "飞书对话";
}

function isInteractiveInputFocused() {
  if (typeof document === "undefined") {
    return false;
  }

  const activeElement = document.activeElement;

  if (!activeElement) {
    return false;
  }

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
    return true;
  }

  if (activeElement instanceof HTMLSelectElement) {
    return true;
  }

  return activeElement instanceof HTMLElement && activeElement.isContentEditable;
}

function buildTaskName(title: string) {
  const trimmed = title.trim();

  if (!trimmed) {
    return "新定时任务";
  }

  return trimmed.length > 24 ? `${trimmed.slice(0, 24)}...` : trimmed;
}

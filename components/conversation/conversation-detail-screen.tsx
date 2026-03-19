"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Composer } from "@/components/composer/composer";
import { useOpenCrabApp } from "@/components/app-shell/opencrab-provider";
import { ConversationThread } from "@/components/conversation/conversation-thread";
import { TaskForm } from "@/components/tasks/task-form";
import {
  formatBrowserSessionLabel,
  formatReasoningEffortLabel,
  formatSandboxModeLabel,
} from "@/lib/opencrab/labels";
import { usePersistedDraft } from "@/lib/opencrab/use-persisted-draft";
import { createTask } from "@/lib/resources/opencrab-api";
import type { TaskSchedule, UploadedAttachment } from "@/lib/resources/opencrab-api-types";

type ConversationDetailScreenProps = {
  conversationId: string;
};

export function ConversationDetailScreen({ conversationId }: ConversationDetailScreenProps) {
  const router = useRouter();
  const {
    conversations,
    conversationMessages,
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
    sendMessage,
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
      name: buildTaskName(activeConversation?.title || "新任务"),
      prompt: latestUserMessage?.content?.trim() || activeConversation?.title || "",
      schedule: {
        preset: "daily" as const,
        time: "09:00",
      },
    }),
    [activeConversation?.title, latestUserMessage?.content],
  );

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
        throw new Error("创建任务失败。");
      }

      setTaskMessageTone("success");
      setTaskMessage("已创建。以后它会按计划继续在这条对话里执行。");
      setCreatedTaskId(response.task.id);
      setIsTaskFormVisible(false);
      router.refresh();
    } catch (error) {
      setTaskMessageTone("error");
      setTaskMessage(error instanceof Error ? error.message : "创建任务失败。");
    } finally {
      setIsCreatingTask(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:h-full lg:min-h-0">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ConversationThread conversationId={conversationId} title={activeConversation.title} />
      </div>
      <div className="shrink-0 border-t border-line bg-background px-4 py-4 lg:px-6">
        <div className="w-full max-w-[1180px] space-y-3">
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
            <button
              type="button"
              onClick={() => {
                setTaskMessage(null);
                setCreatedTaskId(null);
                setIsTaskFormVisible((current) => !current);
              }}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-text transition hover:border-text/20"
            >
              {isTaskFormVisible ? "收起定时任务" : "设为定时任务"}
            </button>
          </div>
          {codexStatus?.ok === false ? (
            <p className="text-[13px] text-[#a34942]">
              OpenCrab 当前还没有完成本机执行环境准备，请先完成初始登录后再回来继续发送。
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
                    查看任务
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}
          {errorMessage ? <p className="text-[13px] text-[#a34942]">{errorMessage}</p> : null}
          {isTaskFormVisible ? (
            <TaskForm
              key={`${conversationId}:${latestUserMessage?.id ?? "empty"}`}
              title="创建定时任务"
              description="把当前对话里的这类工作交给 OpenCrab 定时处理。结果会继续回到这条对话。"
              initialValue={taskSeed}
              submitLabel="创建任务"
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
          />
        </div>
      </div>
    </div>
  );
}

function buildTaskName(title: string) {
  const trimmed = title.trim();

  if (!trimmed) {
    return "新任务";
  }

  return trimmed.length > 24 ? `${trimmed.slice(0, 24)}...` : trimmed;
}

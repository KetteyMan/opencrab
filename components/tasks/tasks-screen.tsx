"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/tasks/task-form";
import {
  createTask,
  getTasks,
  runTask,
  updateTask,
} from "@/lib/resources/opencrab-api";
import type { TaskRecord } from "@/lib/resources/opencrab-api-types";

export function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingTaskAction, setPendingTaskAction] = useState<string | null>(null);
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [createMessageTone, setCreateMessageTone] = useState<"default" | "success" | "error">(
    "default",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTasks();
      setTasks(sortTasks(response.tasks));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "加载任务失败。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadTasks();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadTasks]);

  async function handleCreateTask(input: {
    name: string;
    prompt: string;
    timezone: string | null;
    schedule: TaskRecord["schedule"];
  }) {
    setIsCreating(true);
    setCreateMessage(null);
    setErrorMessage(null);

    try {
      const response = await createTask(input);

      if (!response.task) {
        throw new Error("创建任务失败。");
      }

      const createdTask = response.task;
      setTasks((current) => reconcileTask(current, createdTask));
      setCreateFormKey((current) => current + 1);
      setCreateMessageTone("success");
      setCreateMessage("已创建。OpenCrab 会按这个时间自动执行。");
    } catch (error) {
      setCreateMessageTone("error");
      setCreateMessage(error instanceof Error ? error.message : "创建任务失败。");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleTask(taskId: string, nextStatus: "active" | "paused") {
    setPendingTaskAction(`${taskId}:toggle`);
    setErrorMessage(null);

    try {
      const response = await updateTask(taskId, { status: nextStatus });

      if (!response.task) {
        throw new Error("任务不存在。");
      }

      const updatedTask = response.task;
      setTasks((current) => reconcileTask(current, updatedTask));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "更新任务失败。");
    } finally {
      setPendingTaskAction(null);
    }
  }

  async function handleRunTask(taskId: string) {
    setPendingTaskAction(`${taskId}:run`);
    setErrorMessage(null);

    try {
      const response = await runTask(taskId);

      if (!response.task) {
        throw new Error("任务不存在。");
      }

      const updatedTask = response.task;
      setTasks((current) => reconcileTask(current, updatedTask));
      setCreateMessageTone("success");
      setCreateMessage("任务已经开始执行，结果会自动回流到对应对话。");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "执行任务失败。");
    } finally {
      setPendingTaskAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <TaskForm
        key={createFormKey}
        title="新建任务"
        description="告诉 OpenCrab 要做什么、什么时候做，就够了。"
        submitLabel="创建任务"
        isSubmitting={isCreating}
        message={createMessage}
        messageTone={createMessageTone}
        onSubmit={handleCreateTask}
      />

      <section className="rounded-[24px] border border-line bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-text">已有任务</h2>
            <p className="mt-2 text-[14px] leading-6 text-muted-strong">
              这里只保留最常用的操作：查看、立即执行、暂停或恢复。
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadTasks()}
            className="rounded-full border border-line bg-background px-4 py-2 text-[13px] text-muted-strong transition hover:border-text/20 hover:text-text"
          >
            刷新
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-[16px] border border-[#f3d0cb] bg-[#fff3f1] px-4 py-3 text-[13px] text-[#b42318]">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <EmptyPanel label="正在加载任务..." />
          ) : tasks.length === 0 ? (
            <EmptyPanel label="还没有任务。先创建一个试试。" />
          ) : (
            tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-[20px] border border-line bg-background px-5 py-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="text-[17px] font-semibold tracking-[-0.03em] text-text transition hover:text-[#1a73e8]"
                      >
                        {task.name}
                      </Link>
                      <TaskStatusPill task={task} />
                    </div>
                    <p className="mt-2 truncate text-[14px] leading-6 text-muted-strong">
                      {task.prompt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
                      <span>执行节奏：{task.scheduleLabel}</span>
                      <span>下次执行：{task.nextRunLabel}</span>
                      {task.lastRunStatus ? (
                        <span>
                          最近结果：
                          {task.lastRunStatus === "success"
                            ? "成功"
                            : task.lastRunStatus === "error"
                              ? "失败"
                              : "执行中"}
                        </span>
                      ) : null}
                    </div>
                    {task.lastError ? (
                      <div className="mt-3 rounded-[14px] border border-[#f3d0cb] bg-[#fff3f1] px-3 py-2 text-[13px] text-[#b42318]">
                        最近失败：{task.lastError}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleRunTask(task.id)}
                      disabled={pendingTaskAction !== null}
                      className="rounded-full bg-text px-4 py-2 text-[13px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingTaskAction === `${task.id}:run` ? "启动中..." : "立即执行"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void handleToggleTask(task.id, task.status === "active" ? "paused" : "active")
                      }
                      disabled={pendingTaskAction !== null}
                      className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] text-text transition hover:border-text/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingTaskAction === `${task.id}:toggle`
                        ? "处理中..."
                        : task.status === "active"
                          ? "暂停"
                          : "恢复"}
                    </button>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] text-text transition hover:border-text/20"
                    >
                      查看
                    </Link>
                    {task.conversationId ? (
                      <Link
                        href={`/conversations/${task.conversationId}`}
                        className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] text-text transition hover:border-text/20"
                      >
                        打开结果
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-line bg-surface-muted px-5 py-8 text-[14px] text-muted-strong">
      {label}
    </div>
  );
}

function TaskStatusPill({ task }: { task: TaskRecord }) {
  const tone = task.isRunning
    ? "bg-[#eef3ff] text-[#285cc7]"
    : task.status === "active"
      ? "bg-[#eef8f0] text-[#23633a]"
      : "bg-[#f3f4f6] text-[#5f6368]";

  return (
    <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${tone}`}>
      {task.isRunning ? "执行中" : task.status === "active" ? "运行中" : "已暂停"}
    </span>
  );
}

function reconcileTask(current: TaskRecord[], nextTask: TaskRecord) {
  return sortTasks([nextTask, ...current.filter((task) => task.id !== nextTask.id)]);
}

function sortTasks(tasks: TaskRecord[]) {
  return [...tasks].sort((left, right) => {
    const leftWeight = left.isRunning ? 0 : left.status === "active" ? 1 : 2;
    const rightWeight = right.isRunning ? 0 : right.status === "active" ? 1 : 2;

    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }

    const leftTime = Date.parse(left.nextRunAt || left.updatedAt);
    const rightTime = Date.parse(right.nextRunAt || right.updatedAt);

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    }

    if (Number.isNaN(leftTime)) {
      return 1;
    }

    if (Number.isNaN(rightTime)) {
      return -1;
    }

    return leftTime - rightTime;
  });
}

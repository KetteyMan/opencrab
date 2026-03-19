"use client";

import { useState } from "react";
import { useOpenCrabApp } from "@/components/app-shell/opencrab-provider";
import { Button, buttonClassName } from "@/components/ui/button";

type ChatGptConnectionPanelProps = {
  compact?: boolean;
};

const DEFAULT_BROWSER_AUTH_URL = "http://localhost:1455";
const DEFAULT_DEVICE_AUTH_URL = "https://auth.openai.com/codex/device";

export function ChatGptConnectionPanel({ compact = false }: ChatGptConnectionPanelProps) {
  const {
    chatGptConnectionStatus,
    isChatGptConnectionPending,
    startChatGptConnection,
    cancelChatGptConnection,
    disconnectChatGptConnection,
    refreshChatGptConnectionStatus,
  } = useOpenCrabApp();
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const stage = chatGptConnectionStatus?.stage || "not_connected";
  const authMode = chatGptConnectionStatus?.authMode || "browser";
  const authUrl =
    chatGptConnectionStatus?.authUrl ||
    (authMode === "device_code" ? DEFAULT_DEVICE_AUTH_URL : DEFAULT_BROWSER_AUTH_URL);
  const isConnected = chatGptConnectionStatus?.isConnected === true;
  const isWaiting = stage === "waiting_browser_auth";
  const isConnecting = stage === "connecting";

  async function handleConnect() {
    await startChatGptConnection();
  }

  async function handleCopyCode() {
    if (!chatGptConnectionStatus?.deviceCode || typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyFeedback("failed");
      return;
    }

    try {
      await navigator.clipboard.writeText(chatGptConnectionStatus.deviceCode);
      setCopyFeedback("copied");
      window.setTimeout(() => setCopyFeedback("idle"), 1800);
    } catch {
      setCopyFeedback("failed");
      window.setTimeout(() => setCopyFeedback("idle"), 1800);
    }
  }

  return (
    <div
      className={`rounded-[18px] border ${
        isConnected ? "border-[#cfe7d4] bg-[#f3fbf4]" : "border-line bg-surface-muted"
      } px-5 py-4`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-text">ChatGPT 连接</h2>
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                isConnected
                  ? "bg-[#e7f6ea] text-[#226a39]"
                  : isWaiting || isConnecting
                    ? "bg-[#eef4ff] text-[#335c9c]"
                    : "bg-[#fff1ee] text-[#a34942]"
              }`}
            >
              {formatStageLabel(stage)}
            </span>
          </div>
          <p className="max-w-[640px] text-[13px] leading-6 text-muted-strong">
            {chatGptConnectionStatus?.message || "连接 ChatGPT 后即可开始使用 OpenCrab。"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isConnected ? (
            <Button
              onClick={() => void handleConnect()}
              disabled={isChatGptConnectionPending}
              variant="primary"
            >
              {isWaiting || isConnecting ? "重新打开 ChatGPT" : "连接 ChatGPT"}
            </Button>
          ) : null}
          {isWaiting || isConnecting ? (
            <Button
              onClick={() => void cancelChatGptConnection()}
              disabled={isChatGptConnectionPending}
              variant="secondary"
            >
              取消连接
            </Button>
          ) : null}
          {isConnected ? (
            <Button
              onClick={() => void disconnectChatGptConnection()}
              disabled={isChatGptConnectionPending}
              variant="secondary"
            >
              断开连接
            </Button>
          ) : null}
          <Button
            onClick={() => void refreshChatGptConnectionStatus()}
            disabled={isChatGptConnectionPending}
            variant="secondary"
          >
            刷新状态
          </Button>
        </div>
      </div>

      {isWaiting ? (
        <div className="mt-4 rounded-[16px] border border-[#d4dceb] bg-surface px-4 py-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-strong">
            第 1 步
          </p>
          <p className="mt-2 text-[13px] leading-6 text-muted-strong">
            {authMode === "device_code"
              ? "打开 ChatGPT 授权页，然后输入下面这组一次性代码。"
              : "OpenCrab 已经尝试在系统浏览器里打开 ChatGPT 授权页。请在那个浏览器窗口里完成授权。"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {authMode === "device_code" ? (
              <>
                <code className="rounded-[12px] bg-surface-muted px-4 py-2 text-[20px] font-semibold tracking-[0.18em] text-text">
                  {chatGptConnectionStatus?.deviceCode || "等待生成中"}
                </code>
                <Button
                  onClick={() => void handleCopyCode()}
                  variant="secondary"
                  size="sm"
                >
                  {copyFeedback === "copied"
                    ? "已复制"
                    : copyFeedback === "failed"
                      ? "复制失败"
                      : "复制代码"}
                </Button>
              </>
            ) : null}
            <a
              href={authUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName({ variant: "secondary", size: "sm" })}
            >
              手动打开 ChatGPT
            </a>
          </div>
          {!compact ? (
            <p className="mt-3 text-[12px] leading-6 text-muted">
              第 2 步：如果你当前这个 Chrome 顶部出现“正在受到自动测试软件控制”，请改用你平时的浏览器窗口，或换一个未被 OpenCrab 接管的浏览器来完成登录。然后回到这里等待状态自动刷新。
            </p>
          ) : null}
        </div>
      ) : null}

      {!isConnected && !isWaiting && !isConnecting ? (
        <p className="mt-4 text-[12px] leading-6 text-muted">
          OpenCrab 不会为你单独创建新账号，这里只是帮你把底层连接流程包装成网页交互。
        </p>
      ) : null}
    </div>
  );
}

function formatStageLabel(stage: string) {
  switch (stage) {
    case "connecting":
      return "准备中";
    case "waiting_browser_auth":
      return "等待授权";
    case "connected":
      return "已连接";
    case "expired":
      return "已过期";
    case "error":
      return "连接失败";
    default:
      return "未连接";
  }
}

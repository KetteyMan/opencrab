"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonClassName } from "@/components/ui/button";

type ChannelDetailActionsProps = {
  channelId: "telegram" | "feishu";
  webhookTarget: string;
  hasPublicBaseUrl: boolean;
  canRebind?: boolean;
  canDisconnect?: boolean;
  showCopyButton?: boolean;
};

export function ChannelDetailActions({
  channelId,
  webhookTarget,
  hasPublicBaseUrl,
  canRebind = false,
  canDisconnect = false,
  showCopyButton = true,
}: ChannelDetailActionsProps) {
  const router = useRouter();
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionTone, setActionTone] = useState<"default" | "error">("default");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRebinding, setIsRebinding] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(webhookTarget);
      setCopyMessage(channelId === "telegram" ? "Webhook 地址已复制。" : "兼容 Webhook 地址已复制。");
      window.setTimeout(() => {
        setCopyMessage(null);
      }, 2000);
    } catch {
      setCopyMessage("复制失败，请手动复制。");
    }
  }

  async function runSync(mode: "refresh" | "rebind" | "provision_public_url" | "disconnect") {
    const response = await fetch(`/api/channels/${channelId}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode }),
    });
    const result = (await response.json()) as { ok?: boolean; message?: string; error?: string };

    if (!response.ok) {
      throw new Error(result.error || "同步失败，请稍后再试。");
    }

    setActionTone(result.ok === false ? "error" : "default");
    setActionMessage(result.message || "状态已刷新。");
    router.refresh();
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    setActionMessage(null);

    try {
      await runSync("refresh");
    } catch (error) {
      setActionTone("error");
      setActionMessage(error instanceof Error ? error.message : "同步失败，请稍后再试。");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleProvisionPublicUrl() {
    setIsProvisioning(true);
    setActionMessage(null);

    try {
      await runSync("provision_public_url");
    } catch (error) {
      setActionTone("error");
      setActionMessage(
        error instanceof Error ? error.message : "生成公网地址失败，请稍后再试。",
      );
    } finally {
      setIsProvisioning(false);
    }
  }

  async function handleRebind() {
    setIsRebinding(true);
    setActionMessage(null);

    try {
      await runSync("rebind");
    } catch (error) {
      setActionTone("error");
      setActionMessage(
        error instanceof Error
          ? error.message
          : channelId === "telegram"
            ? "重新绑定失败，请稍后再试。"
            : "重启长连接失败，请稍后再试。",
      );
    } finally {
      setIsRebinding(false);
    }
  }

  async function handleDisconnect() {
    setIsDisconnecting(true);
    setActionMessage(null);

    try {
      await runSync("disconnect");
    } catch (error) {
      setActionTone("error");
      setActionMessage(error instanceof Error ? error.message : "断开连接失败，请稍后再试。");
    } finally {
      setIsDisconnecting(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        {channelId === "telegram" && !hasPublicBaseUrl ? (
          <Button
            onClick={handleProvisionPublicUrl}
            disabled={isProvisioning}
            variant="primary"
          >
            {isProvisioning ? "连接中..." : "自动连接 Telegram"}
          </Button>
        ) : null}
        {channelId === "telegram" && canRebind ? (
          <Button
            onClick={handleRebind}
            disabled={isRebinding}
            variant="secondary"
          >
            {isRebinding ? "重连中..." : "重新连接 Telegram"}
          </Button>
        ) : null}
        {channelId === "feishu" && canRebind ? (
          <Button
            onClick={handleRebind}
            disabled={isRebinding}
            variant="secondary"
          >
            {isRebinding ? "重启中..." : "重启飞书长连接"}
          </Button>
        ) : null}
        {canDisconnect ? (
          <Button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            variant="danger"
          >
            {isDisconnecting ? "断开中..." : "断开连接"}
          </Button>
        ) : null}
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="secondary"
        >
          {isRefreshing ? "检查中..." : "检查状态"}
        </Button>
        {copyMessage ? <span className="text-[12px] text-muted-strong">{copyMessage}</span> : null}
      </div>
      {actionMessage ? (
        <div
          className={`mt-3 text-[12px] ${
            actionTone === "error" ? "text-[#b42318]" : "text-muted-strong"
          }`}
        >
          {actionMessage}
        </div>
      ) : null}
      {showCopyButton ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={handleCopy}
            className={buttonClassName({
              variant: "ghost",
              size: "sm",
              className: "h-auto px-0 text-[12px] text-muted hover:bg-transparent hover:underline",
            })}
          >
            {channelId === "telegram" ? "复制技术地址" : "复制兼容 Webhook 地址"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

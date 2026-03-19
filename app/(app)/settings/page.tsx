"use client";

import { useMemo } from "react";
import { useOpenCrabApp } from "@/components/app-shell/opencrab-provider";
import { ChatGptConnectionPanel } from "@/components/chatgpt/chatgpt-connection-panel";
import { Button } from "@/components/ui/button";
import { AppPage } from "@/components/ui/app-page";
import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  const {
    codexModels,
    selectedBrowserConnectionMode,
    selectedModel,
    selectedReasoningEffort,
    selectedSandboxMode,
    allowOpenAiApiKeyForCommands,
    setSelectedBrowserConnectionMode,
    setSelectedModel,
    setSelectedReasoningEffort,
    setSelectedSandboxMode,
    setAllowOpenAiApiKeyForCommands,
    errorMessage,
  } = useOpenCrabApp();

  const activeModel = useMemo(
    () => codexModels.find((item) => item.id === selectedModel) || codexModels[0] || null,
    [codexModels, selectedModel],
  );

  return (
    <AppPage width="wide" contentClassName="space-y-6">
        <PageHeader title="设置" />

        <section className="rounded-[24px] border border-line bg-surface p-6 shadow-soft">
          <p className="mb-4 text-[14px] leading-6 text-muted-strong">
            OpenCrab 目前没有自己的账号体系，这里复用的是你本机已登录的 ChatGPT 账户状态。
          </p>
          <ChatGptConnectionPanel />
        </section>

        <section className="rounded-[24px] border border-line bg-surface p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-text">OpenCrab 默认配置</h2>
              <p className="mt-3 text-[14px] leading-6 text-muted-strong">
                这些设置只影响 OpenCrab 自己的新会话和后续发送。
              </p>
            </div>
            <div className="inline-flex h-10 items-center rounded-full border border-line bg-surface-muted px-4 text-[13px] text-muted-strong">
              自动保存
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-[13px] font-medium text-text">浏览器连接方式</span>
              <select
                value={selectedBrowserConnectionMode}
                onChange={(event) =>
                  void setSelectedBrowserConnectionMode(
                    event.target.value as typeof selectedBrowserConnectionMode,
                  )
                }
                className="h-11 w-full rounded-[14px] border border-line bg-surface-muted px-4 text-[13px] text-text outline-none"
              >
                <option value="current-browser">连接当前浏览器</option>
                <option value="managed-browser">使用独立浏览器</option>
              </select>
              <p className="text-[12px] text-muted-strong">
                你当前要求的推荐配置是“连接当前浏览器”。这样 OpenCrab 会尽量复用你平时正在用的 Chrome 会话；同一服务进程内会持续复用连接。
              </p>
            </label>

            <label className="space-y-2">
              <span className="text-[13px] font-medium text-text">默认模型</span>
              <select
                value={selectedModel}
                onChange={(event) => void setSelectedModel(event.target.value)}
                className="h-11 w-full rounded-[14px] border border-line bg-surface-muted px-4 text-[13px] text-text outline-none"
              >
                {codexModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[13px] font-medium text-text">默认推理强度</span>
              <select
                value={selectedReasoningEffort}
                onChange={(event) =>
                  void setSelectedReasoningEffort(
                    event.target.value as typeof selectedReasoningEffort,
                  )
                }
                className="h-11 w-full rounded-[14px] border border-line bg-surface-muted px-4 text-[13px] text-text outline-none"
              >
                {(activeModel?.reasoningOptions || []).map((option) => (
                  <option key={option.effort} value={option.effort}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-[13px] font-medium text-text">默认权限模式</span>
              <select
                value={selectedSandboxMode}
                onChange={(event) =>
                  void setSelectedSandboxMode(
                    event.target.value as typeof selectedSandboxMode,
                  )
                }
                className="h-11 w-full rounded-[14px] border border-line bg-surface-muted px-4 text-[13px] text-text outline-none"
              >
                <option value="workspace-write">可写工作区</option>
                <option value="read-only">只读</option>
                <option value="danger-full-access">完全访问</option>
              </select>
              <p className="text-[12px] text-muted-strong">
                推荐使用“可写工作区”。它允许 OpenCrab 创建和修改项目文件，但不会把权限放得过宽。
              </p>
            </label>

            <div className="space-y-3 rounded-[18px] border border-line bg-surface-muted px-4 py-4 md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13px] font-medium text-text">
                    允许命令继承 OPENAI_API_KEY
                  </div>
                  <p className="mt-2 text-[12px] leading-6 text-muted-strong">
                    默认关闭。打开后，OpenCrab 在本机执行命令时会把你当前环境里的
                    <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-[11px] text-text">
                      OPENAI_API_KEY
                    </code>
                    一起传进去，适合你明确知道自己在受信环境里使用。
                  </p>
                </div>
                <Button
                  type="button"
                  role="switch"
                  aria-checked={allowOpenAiApiKeyForCommands}
                  onClick={() => void setAllowOpenAiApiKeyForCommands(!allowOpenAiApiKeyForCommands)}
                  className={`relative h-7 w-12 min-w-12 px-0 ${
                    allowOpenAiApiKeyForCommands ? "bg-[#111111]" : "bg-[#d8d8d2]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      allowOpenAiApiKeyForCommands ? "left-6" : "left-1"
                    }`}
                  />
                </Button>
              </div>
              <p className="text-[12px] leading-6 text-muted">
                建议只在你自己的本机、并且确实需要让命令直接访问 OpenAI API 时再打开。
              </p>
            </div>
          </div>

          {errorMessage ? <p className="mt-4 text-[13px] text-[#a34942]">{errorMessage}</p> : null}
        </section>
    </AppPage>
  );
}

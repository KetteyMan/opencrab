"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ChannelCopyBlockProps = {
  label: string;
  value: string;
  tone?: "default" | "code";
};

export function ChannelCopyBlock({
  label,
  value,
  tone = "default",
}: ChannelCopyBlockProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("已复制");
      window.setTimeout(() => setMessage(null), 1800);
    } catch {
      setMessage("复制失败");
    }
  }

  return (
    <div
      className={`rounded-[18px] border px-4 py-4 ${
        tone === "code" ? "border-line bg-[#fbfaf6]" : "border-line bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{label}</div>
          <div
            className={`mt-2 break-all leading-6 text-muted-strong ${
              tone === "code" ? "font-mono text-[12px]" : "text-[13px]"
            }`}
          >
            {value}
          </div>
        </div>
        <Button
          type="button"
          onClick={handleCopy}
          variant="secondary"
          size="sm"
          className="shrink-0 bg-white"
        >
          复制
        </Button>
      </div>
      {message ? <div className="mt-2 text-[12px] text-muted">{message}</div> : null}
    </div>
  );
}

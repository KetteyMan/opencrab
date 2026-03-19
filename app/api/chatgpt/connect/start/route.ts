import { NextResponse } from "next/server";
import { startChatGptConnection } from "@/lib/chatgpt/connection";

export async function POST() {
  try {
    return NextResponse.json(await startChatGptConnection());
  } catch (error) {
    return NextResponse.json(
      {
        provider: "chatgpt",
        authMode: null,
        stage: "error",
        isConnected: false,
        authUrl: null,
        deviceCode: null,
        codeExpiresAt: null,
        startedAt: null,
        connectedAt: null,
        error: error instanceof Error ? error.message : "发起 ChatGPT 连接失败。",
        message: "发起 ChatGPT 连接失败，请稍后重试。",
      },
      { status: 500 },
    );
  }
}

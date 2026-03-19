import { NextResponse } from "next/server";
import { disconnectChatGptConnection } from "@/lib/chatgpt/connection";

export async function POST() {
  try {
    return NextResponse.json(await disconnectChatGptConnection());
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
        error: error instanceof Error ? error.message : "断开 ChatGPT 连接失败。",
        message: "断开 ChatGPT 连接失败，请稍后重试。",
      },
      { status: 500 },
    );
  }
}

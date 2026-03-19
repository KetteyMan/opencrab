import { NextResponse } from "next/server";
import { getChatGptConnectionStatus } from "@/lib/chatgpt/connection";

export async function GET() {
  try {
    return NextResponse.json(await getChatGptConnectionStatus());
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
        error: error instanceof Error ? error.message : "读取 ChatGPT 连接状态失败。",
        message: "读取 ChatGPT 连接状态失败，请稍后重试。",
      },
      { status: 500 },
    );
  }
}

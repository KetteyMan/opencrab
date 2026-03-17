import { NextResponse } from "next/server";
import {
  ensureBrowserSession,
  ensureBrowserSessionWarmup,
  getBrowserSessionStatus,
} from "@/lib/codex/browser-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getBrowserSessionStatus();

  if (!status.ok && status.status !== "launching" && status.status !== "missing_browser") {
    void ensureBrowserSessionWarmup({ force: true });
  }

  return NextResponse.json(status);
}

export async function POST() {
  const status = await ensureBrowserSession();
  return NextResponse.json(status);
}

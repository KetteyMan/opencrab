import { describe, expect, it } from "vitest";
import { buildSidebarViewModel } from "@/lib/view-models/conversations";
import type { ConversationItem, ConversationMessage, FolderItem } from "@/lib/seed-data";

function createConversation(overrides: Partial<ConversationItem> = {}): ConversationItem {
  return {
    id: "conversation-1",
    title: "Conversation",
    timeLabel: "刚刚",
    lastActivityAt: null,
    preview: "Preview",
    folderId: null,
    hidden: false,
    projectId: null,
    source: "local",
    channelLabel: null,
    remoteChatLabel: null,
    remoteUserLabel: null,
    codexThreadId: null,
    lastAssistantModel: null,
    agentProfileId: null,
    ...overrides,
  };
}

describe("conversation sidebar view model", () => {
  it("sorts recent conversations by last activity descending within the selected mode", () => {
    const folders: FolderItem[] = [];
    const conversations = [
      createConversation({
        id: "conversation-old",
        title: "Old",
        lastActivityAt: "2026-03-22T08:00:00.000Z",
      }),
      createConversation({
        id: "conversation-new",
        title: "New",
        lastActivityAt: "2026-03-24T08:00:00.000Z",
      }),
      createConversation({
        id: "conversation-mid",
        title: "Mid",
        lastActivityAt: "2026-03-23T08:00:00.000Z",
      }),
    ];

    const viewModel = buildSidebarViewModel({
      folders,
      conversations,
      conversationMessages: {},
      expandedFolders: {},
    });

    expect(viewModel.recentConversations.map((conversation) => conversation.id)).toEqual([
      "conversation-new",
      "conversation-mid",
      "conversation-old",
    ]);
  });

  it("prefers the newest message timestamp when ordering folder conversations", () => {
    const folders: FolderItem[] = [{ id: "folder-1", name: "Folder" }];
    const conversations = [
      createConversation({
        id: "conversation-a",
        title: "A",
        folderId: "folder-1",
        lastActivityAt: "2026-03-20T08:00:00.000Z",
      }),
      createConversation({
        id: "conversation-b",
        title: "B",
        folderId: "folder-1",
        lastActivityAt: "2026-03-23T08:00:00.000Z",
      }),
    ];
    const conversationMessages: Record<string, ConversationMessage[]> = {
      "conversation-a": [
        {
          id: "message-a1",
          role: "assistant",
          content: "newer",
          timestamp: "2026-03-24T09:00:00.000Z",
        },
      ],
      "conversation-b": [
        {
          id: "message-b1",
          role: "assistant",
          content: "older",
          timestamp: "2026-03-23T09:00:00.000Z",
        },
      ],
    };

    const viewModel = buildSidebarViewModel({
      folders,
      conversations,
      conversationMessages,
      expandedFolders: {
        "folder-1": true,
      },
    });

    expect(viewModel.folders[0]?.conversations.map((conversation) => conversation.id)).toEqual([
      "conversation-a",
      "conversation-b",
    ]);
  });
});

import { getAllBindings } from "@/lib/channels/channel-store";
import { syncConversationChannelMetadata } from "@/lib/resources/local-store";

export function syncBoundConversationMetadata() {
  const bindings = getAllBindings();

  syncConversationChannelMetadata(
    bindings.map((binding) => ({
      conversationId: binding.conversationId,
      source: binding.channelId,
      channelLabel: binding.channelId === "telegram" ? "Telegram" : "飞书",
      remoteChatLabel: binding.remoteChatLabel,
      remoteUserLabel: binding.remoteUserLabel,
    })),
  );
}

import type { ChannelDetail } from "@/lib/channels/types";

export type ChannelFormField = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  helper: string;
};

export type ChannelFormGroups = {
  primary: ChannelFormField[];
  advanced: ChannelFormField[];
};

export function buildChannelFormGroups(channelId: ChannelDetail["id"]): ChannelFormGroups {
  if (channelId === "telegram") {
    return {
      primary: [
        {
          name: "botToken",
          label: "机器人令牌（Bot Token）",
          placeholder: "123456:AA...",
          type: "password",
          helper: "从 BotFather 获取。保存后，OpenCrab 会先校验令牌，并在已有公网地址时自动设置回调地址。",
        },
      ],
      advanced: [
        {
          name: "webhookSecret",
          label: "回调密钥（Webhook Secret）",
          placeholder: "可选，用于校验 Telegram 请求头",
          type: "password",
          helper: "可选；开启后需要和 Telegram `setWebhook` 里的 `secret_token` 保持一致。",
        },
      ],
    };
  }

  return {
    primary: [
      {
        name: "appId",
        label: "应用 ID（App ID）",
        placeholder: "cli_xxx",
        type: "text",
        helper: "飞书开放平台应用的 app_id。",
      },
      {
        name: "appSecret",
        label: "应用密钥（App Secret）",
        placeholder: "飞书应用密钥",
        type: "password",
        helper: "用于换取 tenant_access_token，并启动飞书长连接。",
      },
    ],
    advanced: [
      {
        name: "verificationToken",
        label: "校验令牌（兼容 Webhook）",
        placeholder: "可选，仅兼容回调模式时使用",
        type: "password",
        helper: "默认长连接模式不需要；只有你仍在使用飞书回调兼容入口时才需要保持一致。",
      },
      {
        name: "encryptKey",
        label: "加密密钥（兼容 Webhook）",
        placeholder: "可选，仅兼容回调模式时使用",
        type: "password",
        helper: "如果你启用了飞书回调加密，这里需要和开放平台中的 Encrypt Key 保持一致。",
      },
    ],
  };
}

export function buildChannelConfiguredHints(channel: ChannelDetail) {
  if (channel.id === "telegram") {
    return [
      channel.configSummary.hasBotToken ? "机器人令牌已保存" : "还没填写机器人令牌",
      channel.configSummary.webhookConfigured ? "已连接成功" : "连接会自动完成",
    ];
  }

  return [
    channel.configSummary.hasAppId ? "应用 ID 已配置" : "应用 ID 未配置",
    channel.configSummary.hasAppSecret ? "应用密钥已配置" : "应用密钥未配置",
    channel.configSummary.socketConnected ? "长连接已启动" : "长连接会自动启动",
    channel.configSummary.hasVerificationToken && channel.configSummary.hasEncryptKey
      ? "兼容回调密钥已齐"
      : "兼容回调可选",
  ];
}

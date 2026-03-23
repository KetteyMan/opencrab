import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const MENTION_PATTERN = /@\S+/g;
const TRAILING_PUNCTUATION_PATTERN = /[，。！？、；：,.!?;:）)】\]>》」]+$/;
const MENTION_CLASS_NAME =
  "mx-[0.08em] inline-flex items-center rounded-full border border-[#d7e4ff] bg-[#eef4ff] px-2 py-[0.08rem] align-baseline text-[0.95em] font-semibold text-[#2d56a3] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]";

export function renderMentionText(text: string, keyPrefix = "mention") {
  if (!text || !MENTION_PATTERN.test(text)) {
    MENTION_PATTERN.lastIndex = 0;
    return text;
  }

  MENTION_PATTERN.lastIndex = 0;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match = MENTION_PATTERN.exec(text);
  let mentionIndex = 0;

  while (match) {
    const rawMention = match[0];
    const start = match.index;
    const mention = rawMention.replace(TRAILING_PUNCTUATION_PATTERN, "");
    const trailingPunctuation = rawMention.slice(mention.length);

    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }

    if (mention.length > 1) {
      nodes.push(
        <span key={`${keyPrefix}-${mentionIndex}`} className={MENTION_CLASS_NAME}>
          {mention}
        </span>,
      );
    } else {
      nodes.push(rawMention);
    }

    if (trailingPunctuation) {
      nodes.push(trailingPunctuation);
    }

    cursor = start + rawMention.length;
    mentionIndex += 1;
    match = MENTION_PATTERN.exec(text);
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  MENTION_PATTERN.lastIndex = 0;
  return nodes;
}

export function renderMentionChildren(children: ReactNode, keyPrefix = "mention"): ReactNode {
  return Children.map(children, (child, index) => transformMentionNode(child, `${keyPrefix}-${index}`));
}

function transformMentionNode(node: ReactNode, keyPrefix: string): ReactNode {
  if (typeof node === "string") {
    return renderMentionText(node, keyPrefix);
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return node;
  }

  const nextChildren = node.props.children;

  if (nextChildren == null) {
    return node;
  }

  return cloneElement(node, {
    ...node.props,
    children: renderMentionChildren(nextChildren, keyPrefix),
  });
}

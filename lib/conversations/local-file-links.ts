export type LocalFileReference = {
  absolutePath: string;
  lineAnchor: string | null;
};

export function resolveConversationMarkdownLink(href: string | undefined) {
  if (!href) {
    return href;
  }

  const reference = parseLocalFileReference(href);

  if (!reference) {
    return href;
  }

  return buildLocalFileOpenRequestHref(reference.absolutePath);
}

export function buildLocalFileOpenRequestHref(absolutePath: string) {
  return `/api/local-files/open?path=${encodeURIComponent(absolutePath)}`;
}

export function parseLocalFileReference(href: string): LocalFileReference | null {
  const trimmed = href.trim();

  if (!trimmed) {
    return null;
  }

  let candidate = trimmed;

  if (candidate.startsWith("#/") || candidate.startsWith("#\\")) {
    candidate = candidate.slice(1);
  } else if (/^#[A-Za-z]:[\\/]/.test(candidate)) {
    candidate = candidate.slice(1);
  }

  if (candidate.startsWith("file://")) {
    candidate = decodeURIComponent(candidate.slice("file://".length));

    if (candidate.startsWith("localhost/")) {
      candidate = candidate.slice("localhost".length);
    }
  }

  const lineAnchorMatch = candidate.match(/#(L\d+)$/i);
  const lineAnchor = lineAnchorMatch?.[1] ?? null;

  if (lineAnchor) {
    candidate = candidate.slice(0, -lineAnchor.length - 1);
  }

  const decodedCandidate = decodeURIComponent(candidate);

  if (!isAbsoluteLocalPath(decodedCandidate)) {
    return null;
  }

  return {
    absolutePath: decodedCandidate,
    lineAnchor,
  };
}

function isAbsoluteLocalPath(value: string) {
  return value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value);
}

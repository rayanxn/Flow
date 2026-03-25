import { createElement, Fragment } from "react";

const MENTION_REGEX = /@\[([^\]]+)\]\(([a-f0-9-]{36})\)/g;

/**
 * Extract user IDs from mention markup in a comment body.
 * Mention format: @[Display Name](user-uuid)
 */
export function parseMentions(body: string): string[] {
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(MENTION_REGEX.source, "g");
  while ((match = re.exec(body)) !== null) {
    ids.push(match[2]);
  }
  return [...new Set(ids)];
}

/**
 * Render a comment body string into React elements,
 * converting @[Name](uuid) patterns into styled mention spans.
 */
export function renderCommentBody(body: string) {
  const parts: (string | ReturnType<typeof createElement>)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  const re = new RegExp(MENTION_REGEX.source, "g");

  while ((match = re.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }
    parts.push(
      createElement(
        "span",
        {
          key: key++,
          className: "text-primary font-medium",
        },
        `@${match[1]}`
      )
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }

  return createElement(Fragment, null, ...parts);
}

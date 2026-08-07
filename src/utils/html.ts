/**
 * Strips HTML tags and decodes entities from API-provided HTML strings
 * (coin descriptions, news bodies) into safe plain text. We never render
 * these with dangerouslySetInnerHTML — this is the only sanctioned path
 * from "HTML string from a third-party API" to on-screen text.
 */
export function stripHtml(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  return textarea.value.trim();
}

/** Relative time, e.g. "3h ago", "2d ago" — falls back to a short date beyond a week. */
export function formatRelativeTime(timestampSeconds: number): string {
  const diffMs = Date.now() - timestampSeconds * 1000;
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(timestampSeconds * 1000);
}

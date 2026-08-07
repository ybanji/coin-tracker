import { useEffect } from "react";

const SITE_NAME = "Coin Tracker";

/**
 * Sets `document.title` (and, when provided, the meta description) for the
 * current route. A full SPA can't generate per-route meta tags server-side,
 * but keeping the title accurate still matters for browser tabs, history,
 * bookmarks, and screen readers — and it's the cheapest lever we have here.
 */
export function usePageTitle(title: string, description?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;

    let descriptionTag: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;
    if (description) {
      descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        previousDescription = descriptionTag.getAttribute("content");
        descriptionTag.setAttribute("content", description);
      }
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== null) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}

import { describe, expect, it } from "vitest";
import { formatRelativeTime, stripHtml } from "@/utils/html";

describe("stripHtml", () => {
  it("removes tags and keeps text content", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("decodes HTML entities", () => {
    expect(stripHtml("Tom &amp; Jerry")).toBe("Tom & Jerry");
  });

  it("trims surrounding whitespace", () => {
    expect(stripHtml("  <div>  padded  </div>  ")).toBe("padded");
  });
});

describe("formatRelativeTime", () => {
  it("reports 'just now' for the current moment", () => {
    expect(formatRelativeTime(Math.floor(Date.now() / 1000))).toBe("just now");
  });

  it("reports minutes for a timestamp under an hour old", () => {
    const tenMinutesAgo = Math.floor(Date.now() / 1000) - 10 * 60;
    expect(formatRelativeTime(tenMinutesAgo)).toBe("10m ago");
  });

  it("reports hours for a timestamp under a day old", () => {
    const threeHoursAgo = Math.floor(Date.now() / 1000) - 3 * 60 * 60;
    expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");
  });
});

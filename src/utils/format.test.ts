import { describe, expect, it } from "vitest";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatPercent,
  formatPrice,
  getChangeDirection,
} from "@/utils/format";

describe("formatPrice", () => {
  it("returns an em dash for null/undefined/NaN", () => {
    expect(formatPrice(null)).toBe("—");
    expect(formatPrice(undefined)).toBe("—");
    expect(formatPrice(NaN)).toBe("—");
  });

  it("uses more decimal precision for sub-$1 values than for $100+ values", () => {
    expect(formatPrice(0.000123, "usd")).toBe("$0.000123");
    expect(formatPrice(64000, "usd")).toBe("$64,000");
  });

  it("formats a $100 price with no forced decimal places", () => {
    expect(formatPrice(100, "usd")).toBe("$100");
  });
});

describe("formatCompactCurrency", () => {
  it("compacts large values with a suffix", () => {
    expect(formatCompactCurrency(1_240_000_000, "usd")).toMatch(/B/);
    expect(formatCompactCurrency(null)).toBe("—");
  });
});

describe("formatCompactNumber", () => {
  it("compacts large plain numbers", () => {
    expect(formatCompactNumber(21_300_000)).toMatch(/M/);
    expect(formatCompactNumber(undefined)).toBe("—");
  });
});

describe("formatPercent", () => {
  it("prefixes positive values with a plus sign", () => {
    expect(formatPercent(2.345)).toBe("+2.35%");
  });

  it("does not prefix negative values with an extra sign", () => {
    expect(formatPercent(-1.5)).toBe("-1.50%");
  });

  it("returns an em dash for missing values", () => {
    expect(formatPercent(null)).toBe("—");
  });
});

describe("getChangeDirection", () => {
  it("classifies positive, negative, zero, and missing values", () => {
    expect(getChangeDirection(5)).toBe("up");
    expect(getChangeDirection(-5)).toBe("down");
    expect(getChangeDirection(0)).toBe("flat");
    expect(getChangeDirection(null)).toBe("flat");
    expect(getChangeDirection(undefined)).toBe("flat");
  });
});

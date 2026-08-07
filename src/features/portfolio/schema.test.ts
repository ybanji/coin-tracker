import { describe, expect, it } from "vitest";
import { holdingFormSchema } from "@/features/portfolio/schema";

const valid = {
  coinId: "bitcoin",
  quantity: "0.5",
  buyPrice: "30000",
  purchaseDate: "2024-01-01",
};

describe("holdingFormSchema", () => {
  it("accepts valid input and coerces numeric strings", () => {
    const result = holdingFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(0.5);
      expect(result.data.buyPrice).toBe(30000);
    }
  });

  it("rejects a missing coin", () => {
    const result = holdingFormSchema.safeParse({ ...valid, coinId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a zero or negative quantity", () => {
    expect(holdingFormSchema.safeParse({ ...valid, quantity: "0" }).success).toBe(false);
    expect(holdingFormSchema.safeParse({ ...valid, quantity: "-5" }).success).toBe(false);
  });

  it("allows a zero buy price (e.g. an airdrop) but rejects negative", () => {
    expect(holdingFormSchema.safeParse({ ...valid, buyPrice: "0" }).success).toBe(true);
    expect(holdingFormSchema.safeParse({ ...valid, buyPrice: "-1" }).success).toBe(false);
  });

  it("rejects a purchase date in the future", () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const result = holdingFormSchema.safeParse({ ...valid, purchaseDate: tomorrow });
    expect(result.success).toBe(false);
  });

  it("rejects a non-numeric quantity", () => {
    const result = holdingFormSchema.safeParse({ ...valid, quantity: "not-a-number" });
    expect(result.success).toBe(false);
  });
});

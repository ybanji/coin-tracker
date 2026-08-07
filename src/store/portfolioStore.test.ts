import { beforeEach, describe, expect, it } from "vitest";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { PortfolioHoldingInput } from "@/types/portfolio";

const sampleHolding: PortfolioHoldingInput = {
  coinId: "bitcoin",
  coinName: "Bitcoin",
  coinSymbol: "btc",
  coinImage: "https://example.com/btc.png",
  quantity: 0.5,
  buyPrice: 30000,
  purchaseDate: "2024-01-01",
};

describe("usePortfolioStore", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ holdings: [] });
  });

  it("adds a holding with a generated id and timestamp", () => {
    usePortfolioStore.getState().addHolding(sampleHolding);
    const { holdings } = usePortfolioStore.getState();
    expect(holdings).toHaveLength(1);
    expect(holdings[0]).toMatchObject(sampleHolding);
    expect(holdings[0]?.id).toBeTruthy();
    expect(holdings[0]?.createdAt).toBeTruthy();
  });

  it("updates an existing holding by id", () => {
    usePortfolioStore.getState().addHolding(sampleHolding);
    const id = usePortfolioStore.getState().holdings[0]!.id;

    usePortfolioStore.getState().updateHolding(id, { ...sampleHolding, quantity: 1.25 });

    expect(usePortfolioStore.getState().holdings[0]?.quantity).toBe(1.25);
  });

  it("removes a holding by id", () => {
    usePortfolioStore.getState().addHolding(sampleHolding);
    const id = usePortfolioStore.getState().holdings[0]!.id;

    usePortfolioStore.getState().removeHolding(id);

    expect(usePortfolioStore.getState().holdings).toHaveLength(0);
  });

  it("clear() empties all holdings", () => {
    usePortfolioStore.getState().addHolding(sampleHolding);
    usePortfolioStore.getState().addHolding({ ...sampleHolding, coinId: "ethereum" });

    usePortfolioStore.getState().clear();

    expect(usePortfolioStore.getState().holdings).toHaveLength(0);
  });
});

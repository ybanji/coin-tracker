import { beforeEach, describe, expect, it } from "vitest";
import { useWatchlistStore } from "@/store/watchlistStore";

describe("useWatchlistStore", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ coinIds: [] });
  });

  it("adds a coin id", () => {
    useWatchlistStore.getState().add("bitcoin");
    expect(useWatchlistStore.getState().coinIds).toEqual(["bitcoin"]);
  });

  it("does not add duplicates", () => {
    useWatchlistStore.getState().add("bitcoin");
    useWatchlistStore.getState().add("bitcoin");
    expect(useWatchlistStore.getState().coinIds).toEqual(["bitcoin"]);
  });

  it("removes a coin id", () => {
    useWatchlistStore.getState().add("bitcoin");
    useWatchlistStore.getState().remove("bitcoin");
    expect(useWatchlistStore.getState().coinIds).toEqual([]);
  });

  it("has() reflects membership", () => {
    expect(useWatchlistStore.getState().has("ethereum")).toBe(false);
    useWatchlistStore.getState().add("ethereum");
    expect(useWatchlistStore.getState().has("ethereum")).toBe(true);
  });

  it("toggle adds when absent and removes when present", () => {
    const { toggle, has } = useWatchlistStore.getState();
    toggle("solana");
    expect(has("solana")).toBe(true);
    toggle("solana");
    expect(has("solana")).toBe(false);
  });
});

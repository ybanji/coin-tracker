/** A single user-entered holding — persisted client-side only, never sent to any server. */
export interface PortfolioHolding {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  quantity: number;
  buyPrice: number;
  purchaseDate: string;
  createdAt: string;
}

export type PortfolioHoldingInput = Omit<PortfolioHolding, "id" | "createdAt">;

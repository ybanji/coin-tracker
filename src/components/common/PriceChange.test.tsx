import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceChange } from "@/components/common/PriceChange";

describe("PriceChange", () => {
  it("renders a formatted positive percentage", () => {
    render(<PriceChange value={3.456} />);
    expect(screen.getByText("+3.46%")).toBeInTheDocument();
  });

  it("renders a formatted negative percentage", () => {
    render(<PriceChange value={-1.2} />);
    expect(screen.getByText("-1.20%")).toBeInTheDocument();
  });

  it("renders an em dash for a missing value", () => {
    render(<PriceChange value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("omits the icon when showIcon is false", () => {
    const { container } = render(<PriceChange value={5} showIcon={false} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("includes an icon by default", () => {
    const { container } = render(<PriceChange value={5} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

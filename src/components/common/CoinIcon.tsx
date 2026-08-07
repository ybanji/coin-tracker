import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CoinIconProps {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

/** Falls back to a two-letter monogram if the CoinGecko-hosted image fails — never a broken-image icon. */
export function CoinIcon({ src, name, size = 28, className }: CoinIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-bg-elevated text-text-muted",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-hidden="true"
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      role="presentation"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

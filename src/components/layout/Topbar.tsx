import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CurrencySelect } from "@/components/common/CurrencySelect";
import { GlobalSearch } from "@/features/search/GlobalSearch";
import { primaryNavItems, secondaryNavItems } from "@/components/navigation/navConfig";

export interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const location = useLocation();

  const title = useMemo(() => {
    const allItems = [...primaryNavItems, ...secondaryNavItems];
    const match = allItems.find((item) => item.to === location.pathname);
    if (match) return match.label;
    return location.pathname.startsWith("/coin/") ? "Coin Details" : "Coin Tracker";
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border-subtle bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Open navigation menu">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <h1 className="shrink-0 text-h3 text-text-primary">{title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <GlobalSearch />
        <CurrencySelect />
        <ThemeToggle />
      </div>
    </header>
  );
}

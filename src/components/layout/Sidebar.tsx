import { Bitcoin } from "lucide-react";
import { NavItem } from "@/components/navigation/NavItem";
import { primaryNavItems, secondaryNavItems } from "@/components/navigation/navConfig";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn("flex h-full w-64 flex-col gap-1 border-r border-border-subtle bg-bg p-4", className)}
    >
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
          <Bitcoin className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <span className="text-body font-semibold tracking-tight text-text-primary">Coin Tracker</span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {primaryNavItems.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="flex flex-col gap-1 border-t border-border-subtle pt-2">
        {secondaryNavItems.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

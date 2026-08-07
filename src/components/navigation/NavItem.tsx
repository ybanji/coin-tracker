import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  onNavigate?: () => void;
}

export function NavItem({ to, label, icon: Icon, comingSoon, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors duration-200",
          "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary",
          isActive && "bg-primary-muted text-primary hover:bg-primary-muted hover:text-primary",
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate">{label}</span>
      {comingSoon && (
        <span className="rounded-sm bg-bg-elevated px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
          Soon
        </span>
      )}
    </NavLink>
  );
}

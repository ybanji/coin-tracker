import {
  LayoutDashboard,
  LineChart,
  Newspaper,
  Settings,
  Star,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavConfigItem {
  to: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export const primaryNavItems: NavConfigItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/markets", label: "Markets", icon: LineChart },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/portfolio", label: "Portfolio", icon: Wallet },
  { to: "/news", label: "News", icon: Newspaper },
];

export const secondaryNavItems: NavConfigItem[] = [{ to: "/settings", label: "Settings", icon: Settings }];

import { Moon, Sun, SunMoon } from "lucide-react";
import { useThemeStore, type ThemeMode } from "@/store/themeStore";
import { Button } from "@/components/ui/Button";

const cycle: Record<ThemeMode, ThemeMode> = {
  dark: "light",
  light: "system",
  system: "dark",
};

const iconFor: Record<ThemeMode, typeof Sun> = {
  dark: Moon,
  light: Sun,
  system: SunMoon,
};

const labelFor: Record<ThemeMode, string> = {
  dark: "Dark theme",
  light: "Light theme",
  system: "System theme",
};

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const Icon = iconFor[mode];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(cycle[mode])}
      aria-label={`${labelFor[mode]}. Click to switch theme.`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}

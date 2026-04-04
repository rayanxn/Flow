"use client";

import { useSyncExternalStore } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeMode } from "@/lib/theme";

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const ActiveIcon = mounted ? (resolvedTheme === "dark" ? Moon : Sun) : Laptop;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
        >
          <ActiveIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="normal-case tracking-normal text-sm text-text">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemeMode)}
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <Icon className="mr-2 h-4 w-4 text-text-muted" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

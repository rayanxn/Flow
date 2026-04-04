"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  isThemeMode,
  resolveTheme,
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : "system";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia(THEME_MEDIA_QUERY).matches;
  const resolved = resolveTheme(theme, prefersDark);

  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  return resolved;
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);

    const syncTheme = () => {
      setResolvedTheme(applyTheme(theme));
    };

    syncTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", syncTheme);
      return () => mediaQuery.removeEventListener("change", syncTheme);
    }

    return undefined;
  }, [theme]);

  useEffect(() => {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

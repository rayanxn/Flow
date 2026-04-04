export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "flow-theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveTheme(
  theme: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme {
  if (theme === "system") {
    return prefersDark ? "dark" : "light";
  }

  return theme;
}

export function getThemeScript() {
  return `(() => {
    const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const mediaQuery = ${JSON.stringify(THEME_MEDIA_QUERY)};
    const root = document.documentElement;
    const stored = window.localStorage.getItem(storageKey);
    const theme =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    const prefersDark = window.matchMedia(mediaQuery).matches;
    const resolved =
      theme === "system" ? (prefersDark ? "dark" : "light") : theme;

    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  })();`;
}

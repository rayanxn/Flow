"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToaster() {
  const { resolvedTheme } = useTheme();

  return <Toaster position="bottom-right" theme={resolvedTheme} />;
}

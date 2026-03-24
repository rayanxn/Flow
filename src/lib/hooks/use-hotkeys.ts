"use client";

import { useEffect } from "react";

type HotkeyDef = {
  key: string;
  meta?: boolean;
  shift?: boolean;
  handler: (e: KeyboardEvent) => void;
};

function isEditableTarget(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export function useHotkeys(hotkeys: HotkeyDef[]) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      for (const hk of hotkeys) {
        const metaMatch = hk.meta ? e.metaKey || e.ctrlKey : true;
        const shiftMatch = hk.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = e.key.toLowerCase() === hk.key.toLowerCase();

        if (metaMatch && shiftMatch && keyMatch) {
          // Allow meta+key combos even in editable fields
          // but block plain character keys in editable fields
          if (!hk.meta && isEditableTarget(e)) continue;

          e.preventDefault();
          e.stopPropagation();
          hk.handler(e);
          return;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkeys]);
}

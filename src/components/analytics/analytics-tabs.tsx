"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "sprints", label: "Sprints" },
] as const;

export function AnalyticsTabs({
  activeTab,
  hasSprints,
}: {
  activeTab: "overview" | "sprints";
  hasSprints: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTabChange(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    // Clear tab-specific params when switching
    if (tab === "overview") params.delete("sprint");
    if (tab === "sprints") params.delete("range");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-6 border-b border-border/50">
      {tabs.map(({ key, label }) => {
        if (key === "sprints" && !hasSprints) return null;

        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`pb-2.5 text-sm font-medium -mb-px transition-colors ${
              isActive
                ? "border-b-2 border-text text-text"
                : "text-text-muted hover:text-text"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

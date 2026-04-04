"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { TimeRange } from "@/lib/utils/analytics";

const ranges: TimeRange[] = ["7d", "14d", "30d", "90d"];

export function TimeRangeSelector({ activeRange }: { activeRange: TimeRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(range: TimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    if (!params.has("tab")) params.set("tab", "overview");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-surface-inset p-1">
      {ranges.map((range) => {
        const isActive = activeRange === range;
        return (
          <button
            key={range}
            onClick={() => handleChange(range)}
            className={`rounded-md px-3 py-1 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}

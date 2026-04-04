"use client";

import { useEffect, useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function FeatureSprint() {
  const [activeDay, setActiveDay] = useState(3); // Wednesday

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDay((d) => (d + 1) % 7);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const taskCounts = [0, 3, 2, 4, 5, 1, 0];

  return (
    <div className="flex flex-col items-center px-4 pt-6">
      {/* Day picker */}
      <div className="flex gap-2">
        {DAYS.map((day, i) => (
          <button
            key={`${day}-${i}`}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 ${
              i === activeDay
                ? "bg-primary text-background scale-110"
                : "text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 w-full rounded-xl border border-border bg-surface-hover px-4 py-3 text-center">
        <span className="font-mono text-sm text-text-secondary">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][activeDay]} — {taskCounts[activeDay]} tasks
        </span>
      </div>

      {/* Button */}
      <button className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-background transition-transform duration-200 hover:scale-[1.02]">
        Commit Plan
      </button>
    </div>
  );
}

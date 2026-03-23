"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { label: "Sprint Planning", priority: "bg-text", sub: "" },
  { label: "Design Review", priority: "bg-text-muted", sub: "" },
  { label: "Bug Fix", priority: "bg-accent", sub: "P0 — Critical" },
];

export function FeatureTriage() {
  const [order, setOrder] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        next.push(next.shift()!);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-52 overflow-hidden px-4 pt-6">
      {order.map((itemIndex, position) => {
        const item = ITEMS[itemIndex];
        return (
          <div
            key={item.label}
            className="absolute right-4 left-4 rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm transition-all duration-500"
            style={{
              transform: `translateY(${position * 56}px) scale(${1 - position * 0.02})`,
              opacity: 1 - position * 0.15,
              zIndex: 3 - position,
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-1 rounded-full ${item.priority}`} />
                <div>
                  <span className="text-sm font-medium text-text">{item.label}</span>
                  {item.sub && (
                    <p className="mt-0.5 text-[11px] text-text-muted">{item.sub}</p>
                  )}
                </div>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  item.priority === "bg-accent" ? "bg-accent" : item.priority
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

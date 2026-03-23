"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  { action: "Moved API migration to In Review", time: "2m ago" },
  { action: "Assigned Auth flow to Elena", time: "5m ago" },
  { action: "Closed Dashboard redesign", time: "12m ago" },
];

export function FeatureActivity() {
  const [visibleChars, setVisibleChars] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);

  const currentEvent = EVENTS[eventIndex];
  const fullText = currentEvent.action;

  useEffect(() => {
    if (visibleChars < fullText.length) {
      const timeout = setTimeout(() => setVisibleChars((c) => c + 1), 35);
      return () => clearTimeout(timeout);
    }

    // Pause then move to next event
    const pause = setTimeout(() => {
      setEventIndex((i) => (i + 1) % EVENTS.length);
      setVisibleChars(0);
    }, 2000);
    return () => clearTimeout(pause);
  }, [visibleChars, fullText.length]);

  return (
    <div className="px-4 pt-5">
      {/* Live badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="font-mono text-[11px] tracking-wider text-text-muted uppercase">
          Live Feed
        </span>
      </div>

      {/* Events */}
      <div className="space-y-3">
        {EVENTS.map((event, i) => (
          <div key={event.action} className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full bg-border" />
            <div className="min-w-0">
              <p className="text-sm text-text">
                {i === eventIndex ? (
                  <>
                    {fullText.slice(0, visibleChars)}
                    <span className="animate-pulse text-accent">|</span>
                  </>
                ) : (
                  event.action
                )}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-text-muted">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const SIDEBAR_ITEMS = [
  { label: "Projects", active: true },
  { label: "My Issues", active: false },
  { label: "Views", active: false },
  { label: "Teams", active: false },
];

interface CardData {
  id: string;
  label: string;
  column: number; // 0=TODO, 1=IN PROGRESS, 2=DONE
}

const INITIAL_CARDS: CardData[] = [
  { id: "a", label: "Fix auth token", column: 0 },
  { id: "b", label: "Add shortcuts", column: 0 },
  { id: "c", label: "Migrate settings", column: 1 },
  { id: "d", label: "CI pipeline", column: 2 },
  { id: "e", label: "Integration tests", column: 2 },
];

const COLUMN_TITLES = ["TODO", "IN PROGRESS", "DONE"];

// Sequence of moves: [cardId, toColumn]
const MOVES: [string, number][] = [
  ["a", 1], // Fix auth token → IN PROGRESS
  ["c", 2], // Migrate settings → DONE
  ["b", 1], // Add shortcuts → IN PROGRESS
  ["a", 2], // Fix auth token → DONE
  ["b", 2], // Add shortcuts → DONE
  // Reset cycle
  ["a", 0],
  ["b", 0],
  ["c", 1],
];

export function HeroMockup() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [moveIndex, setMoveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoveIndex((prev) => {
        const idx = prev % MOVES.length;
        const [cardId, toColumn] = MOVES[idx];
        setCards((current) =>
          current.map((c) => (c.id === cardId ? { ...c, column: toColumn } : c)),
        );
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-36 border-r border-border p-4">
            <ul className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    item.active ? "bg-background font-medium text-text" : "text-text-muted"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.active ? "bg-text" : "bg-text-muted"
                    }`}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Board */}
          <div className="flex-1 p-4">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-text">Sprint 24</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
                Active
              </span>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 gap-3">
              {COLUMN_TITLES.map((title, colIdx) => {
                const columnCards = cards.filter((c) => c.column === colIdx);
                return (
                  <div key={title} className="min-h-[100px]">
                    <div className="mb-2 text-[10px] font-medium tracking-wider text-text-muted uppercase">
                      {title}
                    </div>
                    <div className="space-y-2">
                      {columnCards.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-lg border border-border bg-surface-hover px-3 py-2 text-xs text-text-secondary transition-all duration-700 ease-out"
                          style={{
                            animation: "fadeSlideIn 0.5s ease-out",
                          }}
                        >
                          {card.label}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        Sprint board view
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface IssueChecklistProps {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function IssueChecklist({ items, onUpdate }: IssueChecklistProps) {
  const [newText, setNewText] = useState("");

  const toggleItem = useCallback(
    (id: string) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      onUpdate(updated);
    },
    [items, onUpdate]
  );

  const removeItem = useCallback(
    (id: string) => {
      onUpdate(items.filter((item) => item.id !== id));
    },
    [items, onUpdate]
  );

  const updateText = useCallback(
    (id: string, text: string) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, text } : item
      );
      onUpdate(updated);
    },
    [items, onUpdate]
  );

  const addItem = useCallback(() => {
    if (!newText.trim()) return;
    const item: ChecklistItem = {
      id: generateId(),
      text: newText.trim(),
      completed: false,
    };
    onUpdate([...items, item]);
    setNewText("");
  }, [newText, items, onUpdate]);

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-hover overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{
                width: `${(completedCount / items.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-[11px] text-text-muted tabular-nums shrink-0">
            {completedCount}/{items.length}
          </span>
        </div>
      )}

      {/* Items */}
      <div className="space-y-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 group rounded-md px-1 py-0.5 -mx-1 hover:bg-surface-hover/50"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className={cn(
                "shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                item.completed
                  ? "bg-green-500 border-green-500"
                  : "border-border hover:border-border-strong"
              )}
            >
              {item.completed && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M2 5l2.5 2.5L8 3" />
                </svg>
              )}
            </button>
            <input
              value={item.text}
              onChange={(e) => updateText(item.id, e.target.value)}
              onBlur={() => {
                if (!item.text.trim()) removeItem(item.id);
              }}
              className={cn(
                "flex-1 bg-transparent border-none text-sm outline-none",
                item.completed ? "line-through text-text-muted" : "text-text"
              )}
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-text-muted shrink-0" />
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add an item..."
          className="flex-1 bg-transparent border-none text-sm text-text placeholder:text-text-muted outline-none"
        />
      </div>
    </div>
  );
}

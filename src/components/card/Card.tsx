"use client";

import { CalendarDays } from "lucide-react";

import { formatCardDueDateLabel } from "@/lib/cards";
import type { Card as CardRecord } from "@/types";

interface TaskCardProps {
  card: CardRecord;
  onOpen: () => void;
}

export default function TaskCard({ card, onOpen }: TaskCardProps) {
  const dueDateLabel = formatCardDueDateLabel(card.due_date);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border bg-card px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-sm font-medium text-foreground">{card.title}</p>
      {dueDateLabel ? (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {dueDateLabel}
        </div>
      ) : null}
    </button>
  );
}

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
      className="w-full rounded-xl bg-white px-3 py-2.5 text-left shadow-[0_1px_1px_rgba(15,23,42,0.08),0_6px_18px_rgba(15,23,42,0.08)] ring-1 ring-slate-950/6 transition hover:-translate-y-0.5 hover:shadow-[0_1px_1px_rgba(15,23,42,0.1),0_10px_24px_rgba(15,23,42,0.12)]"
    >
      <p className="text-sm font-medium leading-5 text-slate-800">{card.title}</p>
      {dueDateLabel ? (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
          <CalendarDays className="size-3.5" />
          {dueDateLabel}
        </div>
      ) : null}
    </button>
  );
}

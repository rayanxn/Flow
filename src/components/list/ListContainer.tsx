"use client";

import type { Card } from "@/types";

interface ListContainerProps {
  cards: Card[];
}

export default function ListContainer({ cards }: ListContainerProps) {
  if (cards.length === 0) {
    return (
      <div className="flex-1 px-2 py-1">
        <p className="py-3 text-center text-sm text-muted-foreground">No cards yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto px-2 py-1">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm"
        >
          {card.title}
        </div>
      ))}
      <p className="px-1 py-1 text-sm text-muted-foreground">Add a card...</p>
    </div>
  );
}

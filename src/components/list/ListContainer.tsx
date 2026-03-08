"use client";

import { useMemo, useState } from "react";

import type { Card as CardRecord, CardUpdatePatch } from "@/types";
import AddCardInput from "@/components/card/AddCardInput";
import CardModal from "@/components/card/CardModal";
import TaskCard from "@/components/card/Card";

interface ListContainerProps {
  cards: CardRecord[];
  onAddCard: (title: string) => Promise<void>;
  onUpdateCard: (cardId: string, input: CardUpdatePatch) => Promise<void>;
  onDeleteCard: (cardId: string) => Promise<void>;
}

export default function ListContainer({
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: ListContainerProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId]
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-1">
        {cards.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">No cards yet</p>
        ) : (
          cards.map((card) => (
            <TaskCard key={card.id} card={card} onOpen={() => setSelectedCardId(card.id)} />
          ))
        )}
        <AddCardInput onAdd={onAddCard} />
      </div>

      <CardModal
        card={selectedCard}
        open={Boolean(selectedCard)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCardId(null);
          }
        }}
        onUpdate={onUpdateCard}
        onDelete={onDeleteCard}
      />
    </>
  );
}

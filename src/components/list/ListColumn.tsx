"use client";

import type { CardUpdatePatch, ListWithCards } from "@/types";
import ListContainer from "@/components/list/ListContainer";
import ListHeader from "@/components/list/ListHeader";

interface ListColumnProps {
  list: ListWithCards;
  onUpdateTitle: (title: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddCard: (title: string) => Promise<void>;
  onUpdateCard: (cardId: string, input: CardUpdatePatch) => Promise<void>;
  onDeleteCard: (cardId: string) => Promise<void>;
}

export default function ListColumn({
  list,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: ListColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/50">
      <ListHeader list={list} onUpdateTitle={onUpdateTitle} onDelete={onDelete} />
      <ListContainer
        cards={list.cards}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { CardUpdatePatch, ListWithCards } from "@/types";
import ListHeader from "@/components/list/ListHeader";
import AddCardInput from "@/components/card/AddCardInput";
import CardModal from "@/components/card/CardModal";
import SortableCard from "@/components/dnd/SortableCard";

interface SortableListProps {
  list: ListWithCards;
  onUpdateTitle: (title: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddCard: (title: string) => Promise<void>;
  onUpdateCard: (cardId: string, input: CardUpdatePatch) => Promise<void>;
  onDeleteCard: (cardId: string) => Promise<void>;
}

export default function SortableList({
  list,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: SortableListProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const selectedCard = useMemo(
    () => list.cards.find((card) => card.id === selectedCardId) ?? null,
    [list.cards, selectedCardId]
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `list:${list.id}`,
    data: { type: "list" },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list-drop:${list.id}`,
    data: { type: "list-drop", listId: list.id },
  });

  const cardIds = useMemo(
    () => list.cards.map((card) => `card:${card.id}`),
    [list.cards]
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="board-scrollbar flex max-h-full min-h-[116px] w-[272px] shrink-0 snap-start flex-col rounded-xl bg-[#f1f2f4]/94 shadow-[0_1px_1px_rgba(15,23,42,0.12),0_10px_24px_rgba(15,23,42,0.14)] ring-1 ring-slate-950/6 backdrop-blur-sm"
      >
        <div {...attributes} {...listeners}>
          <ListHeader list={list} onUpdateTitle={onUpdateTitle} onDelete={onDelete} />
        </div>

        <div ref={setDroppableRef} className="min-h-0 flex-1">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            <div className="board-scrollbar flex h-full min-h-0 flex-col gap-2 overflow-y-auto px-2 pb-2">
              {list.cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  listId={list.id}
                  onOpen={() => setSelectedCardId(card.id)}
                />
              ))}
              <AddCardInput onAdd={onAddCard} />
            </div>
          </SortableContext>
        </div>
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

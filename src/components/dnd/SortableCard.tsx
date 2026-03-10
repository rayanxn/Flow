"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card as CardRecord } from "@/types";
import TaskCard from "@/components/card/Card";

interface SortableCardProps {
  card: CardRecord;
  listId: string;
  onOpen: () => void;
}

export default function SortableCard({ card, listId, onOpen }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card:${card.id}`,
    data: { type: "card", listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard card={card} onOpen={onOpen} />
    </div>
  );
}

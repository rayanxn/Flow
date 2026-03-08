"use client";

import type { ListWithCards } from "@/types";
import ListContainer from "@/components/list/ListContainer";
import ListHeader from "@/components/list/ListHeader";

interface ListColumnProps {
  list: ListWithCards;
  onUpdateTitle: (title: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function ListColumn({ list, onUpdateTitle, onDelete }: ListColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/50">
      <ListHeader list={list} onUpdateTitle={onUpdateTitle} onDelete={onDelete} />
      <ListContainer cards={list.cards} />
    </div>
  );
}

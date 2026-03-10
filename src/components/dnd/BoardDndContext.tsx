"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragCancelEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { generatePositionBetween } from "@/lib/fractional-index";
import { useBoardStore } from "@/store/boardStore";
import type { Card as CardRecord, ListWithCards } from "@/types";
import TaskCard from "@/components/card/Card";

interface BoardDndContextProps {
  lists: ListWithCards[];
  children: React.ReactNode;
}

type ActiveItem =
  | { type: "list"; id: string }
  | { type: "card"; id: string };

type ParsedItem = ActiveItem | { type: "list-drop"; id: string } | null;

type ActiveSnapshot =
  | { type: "list"; id: string; position: string }
  | { type: "card"; id: string; listId: string; position: string };

function parseId(prefixedId: string): ParsedItem {
  const colonIndex = prefixedId.indexOf(":");

  if (colonIndex === -1) {
    return null;
  }

  const type = prefixedId.slice(0, colonIndex);
  const id = prefixedId.slice(colonIndex + 1);

  if (!id) {
    return null;
  }

  if (type === "list" || type === "card" || type === "list-drop") {
    return { type, id };
  }

  return null;
}

function findCardInLists(lists: ListWithCards[], cardId: string): CardRecord | null {
  for (const list of lists) {
    const card = list.cards.find((item) => item.id === cardId);

    if (card) {
      return card;
    }
  }

  return null;
}

function findListByCardId(lists: ListWithCards[], cardId: string): ListWithCards | null {
  for (const list of lists) {
    if (list.cards.some((card) => card.id === cardId)) {
      return list;
    }
  }

  return null;
}

function resolveListId(lists: ListWithCards[], item: ParsedItem): string | null {
  if (!item) {
    return null;
  }

  if (item.type === "list" || item.type === "list-drop") {
    return item.id;
  }

  return findListByCardId(lists, item.id)?.id ?? null;
}

function calculatePositionAtIndex(
  items: { id: string; position: string }[],
  activeId: string,
  targetIndex: number
): string {
  const filtered = items.filter((item) => item.id !== activeId);
  const boundedIndex = Math.max(0, Math.min(targetIndex, filtered.length));
  const before = filtered[boundedIndex - 1]?.position ?? null;
  const after = filtered[boundedIndex]?.position ?? null;

  return generatePositionBetween(before, after);
}

function calculatePositionFromTarget(
  items: { id: string; position: string }[],
  activeId: string,
  overId: string,
  insertAfter: boolean
): string | null {
  const filtered = items.filter((item) => item.id !== activeId);
  const overIndex = filtered.findIndex((item) => item.id === overId);

  if (overIndex === -1) {
    return null;
  }

  return calculatePositionAtIndex(items, activeId, overIndex + (insertAfter ? 1 : 0));
}

function isPastMidpoint(
  event: DragOverEvent | DragEndEvent,
  orientation: "horizontal" | "vertical"
) {
  const translated = event.active.rect.current.translated;

  if (!translated || !event.over) {
    return false;
  }

  if (orientation === "horizontal") {
    const activeMidpoint = translated.left + translated.width / 2;
    const overMidpoint = event.over.rect.left + event.over.rect.width / 2;

    return activeMidpoint > overMidpoint;
  }

  const activeMidpoint = translated.top + translated.height / 2;
  const overMidpoint = event.over.rect.top + event.over.rect.height / 2;

  return activeMidpoint > overMidpoint;
}

function getCardDestination(
  lists: ListWithCards[],
  activeCardId: string,
  overItem: ParsedItem,
  insertAfter: boolean
): { listId: string; position: string } | null {
  if (!overItem) {
    return null;
  }

  const targetListId = resolveListId(lists, overItem);

  if (!targetListId) {
    return null;
  }

  const targetList = lists.find((list) => list.id === targetListId);

  if (!targetList) {
    return null;
  }

  const items = targetList.cards.map((card) => ({
    id: card.id,
    position: card.position,
  }));

  if (overItem.type === "card") {
    const position = calculatePositionFromTarget(items, activeCardId, overItem.id, insertAfter);

    if (!position) {
      return null;
    }

    return { listId: targetListId, position };
  }

  return {
    listId: targetListId,
    position: calculatePositionAtIndex(items, activeCardId, items.length),
  };
}

function getListDestination(
  lists: ListWithCards[],
  activeListId: string,
  overItem: ParsedItem,
  insertAfter: boolean
): string | null {
  const overListId = resolveListId(lists, overItem);

  if (!overListId) {
    return null;
  }

  const items = lists.map((list) => ({
    id: list.id,
    position: list.position,
  }));

  return calculatePositionFromTarget(items, activeListId, overListId, insertAfter);
}

export default function BoardDndContext({ lists, children }: BoardDndContextProps) {
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);
  const activeSnapshotRef = useRef<ActiveSnapshot | null>(null);

  const currentBoardLists = useBoardStore((state) => state.currentBoardLists);
  const moveCardLocal = useBoardStore((s) => s.moveCardLocal);
  const moveCard = useBoardStore((s) => s.moveCard);
  const reorderListLocal = useBoardStore((s) => s.reorderListLocal);
  const reorderList = useBoardStore((s) => s.reorderList);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const boardLists = useMemo(
    () => (currentBoardLists.length > 0 ? currentBoardLists : lists),
    [currentBoardLists, lists]
  );

  const getLatestLists = useCallback(() => {
    const nextLists = useBoardStore.getState().currentBoardLists;

    return nextLists.length > 0 ? nextLists : lists;
  }, [lists]);

  const restoreSnapshot = useCallback(
    (snapshot: ActiveSnapshot | null) => {
      if (!snapshot) {
        return;
      }

      if (snapshot.type === "card") {
        moveCardLocal(snapshot.id, snapshot.listId, snapshot.position);
        return;
      }

      reorderListLocal(snapshot.id, snapshot.position);
    },
    [moveCardLocal, reorderListLocal]
  );

  const listIds = boardLists.map((list) => `list:${list.id}`);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const parsedActive = parseId(String(event.active.id));

    if (!parsedActive || parsedActive.type === "list-drop") {
      return;
    }

    const currentLists = getLatestLists();
    setActiveItem(parsedActive);

    if (parsedActive.type === "card") {
      const activeCard = findCardInLists(currentLists, parsedActive.id);

      activeSnapshotRef.current = activeCard
        ? {
            type: "card",
            id: activeCard.id,
            listId: activeCard.list_id,
            position: activeCard.position,
          }
        : null;

      return;
    }

    const activeList = currentLists.find((list) => list.id === parsedActive.id);

    activeSnapshotRef.current = activeList
      ? {
          type: "list",
          id: activeList.id,
          position: activeList.position,
        }
      : null;
  }, [getLatestLists]);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = parseId(String(active.id));
      const overData = parseId(String(over.id));

      if (!activeData || !overData || activeData.id === overData.id) {
        return;
      }

      const currentLists = getLatestLists();

      if (activeData.type === "card") {
        const activeCard = findCardInLists(currentLists, activeData.id);
        const destination = getCardDestination(
          currentLists,
          activeData.id,
          overData,
          overData.type === "card" ? isPastMidpoint(event, "vertical") : true
        );

        if (!activeCard || !destination) {
          return;
        }

        if (
          activeCard.list_id === destination.listId &&
          activeCard.position === destination.position
        ) {
          return;
        }

        moveCardLocal(activeData.id, destination.listId, destination.position);
        return;
      }

      if (activeData.type === "list") {
        const activeList = currentLists.find((list) => list.id === activeData.id);
        const destination = getListDestination(
          currentLists,
          activeData.id,
          overData,
          isPastMidpoint(event, "horizontal")
        );

        if (!activeList || !destination || activeList.position === destination) {
          return;
        }

        reorderListLocal(activeData.id, destination);
      }
    },
    [getLatestLists, moveCardLocal, reorderListLocal]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event;
      const snapshot = activeSnapshotRef.current;

      activeSnapshotRef.current = null;
      setActiveItem(null);

      if (!over) {
        restoreSnapshot(snapshot);
        return;
      }

      const currentLists = getLatestLists();

      if (!snapshot) {
        return;
      }

      if (snapshot.type === "list") {
        const activeList = currentLists.find((list) => list.id === snapshot.id);

        if (!activeList || activeList.position === snapshot.position) {
          return;
        }

        void reorderList(activeList.id, activeList.position).catch(() => {
          reorderListLocal(snapshot.id, snapshot.position);
        });
        return;
      }

      const activeCard = findCardInLists(currentLists, snapshot.id);

      if (
        !activeCard ||
        (activeCard.list_id === snapshot.listId && activeCard.position === snapshot.position)
      ) {
        return;
      }

      void moveCard({
        cardId: activeCard.id,
        listId: activeCard.list_id,
        position: activeCard.position,
      }).catch(() => {
        moveCardLocal(snapshot.id, snapshot.listId, snapshot.position);
      });
    },
    [getLatestLists, moveCard, moveCardLocal, reorderList, reorderListLocal, restoreSnapshot]
  );

  const handleDragCancel = useCallback((_event: DragCancelEvent) => {
    const snapshot = activeSnapshotRef.current;

    activeSnapshotRef.current = null;
    setActiveItem(null);
    restoreSnapshot(snapshot);
  }, [restoreSnapshot]);

  const activeCard = activeItem?.type === "card"
    ? findCardInLists(boardLists, activeItem.id)
    : null;

  const activeList = activeItem?.type === "list"
    ? boardLists.find((list) => list.id === activeItem.id)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay>
        {activeCard ? (
          <div className="rotate-3 shadow-xl">
            <TaskCard card={activeCard} onOpen={() => {}} />
          </div>
        ) : null}
        {activeList ? (
          <div className="w-72 rotate-2 rounded-xl border bg-muted/50 p-3 shadow-xl">
            <p className="text-sm font-semibold">{activeList.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeList.cards.length} card{activeList.cards.length !== 1 ? "s" : ""}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

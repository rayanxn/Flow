"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { getBoardBackground } from "@/lib/backgrounds";
import { sortByPosition } from "@/lib/fractional-index";
import type { BoardWithDetails, CardUpdatePatch } from "@/types";
import AddListButton from "@/components/list/AddListButton";
import BoardHeader from "@/components/board/BoardHeader";
import BoardDndContext from "@/components/dnd/BoardDndContext";
import SortableList from "@/components/dnd/SortableList";
import { useBoardStore } from "@/store/boardStore";

interface BoardDetailClientProps {
  initialBoard: BoardWithDetails;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export default function BoardDetailClient({ initialBoard }: BoardDetailClientProps) {
  const currentBoard = useBoardStore((state) => state.currentBoard);
  const currentBoardLists = useBoardStore((state) => state.currentBoardLists);
  const setCurrentBoardDetail = useBoardStore((state) => state.setCurrentBoardDetail);
  const clearCurrentBoardDetail = useBoardStore((state) => state.clearCurrentBoardDetail);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const addList = useBoardStore((state) => state.addList);
  const updateListTitle = useBoardStore((state) => state.updateListTitle);
  const removeList = useBoardStore((state) => state.removeList);
  const addCard = useBoardStore((state) => state.addCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const removeCard = useBoardStore((state) => state.removeCard);

  const initialLists = useMemo(
    () =>
      sortByPosition(initialBoard.lists).map((list) => ({
        ...list,
        cards: sortByPosition(list.cards),
      })),
    [initialBoard]
  );

  useEffect(() => {
    setCurrentBoardDetail(initialBoard);

    return () => {
      clearCurrentBoardDetail();
    };
  }, [setCurrentBoardDetail, clearCurrentBoardDetail, initialBoard]);

  const board = currentBoard ?? initialBoard;
  const lists = currentBoard ? currentBoardLists : initialLists;
  const background = getBoardBackground(board.background);

  const handleUpdateBoardTitle = async (title: string) => {
    try {
      const updated = await updateBoard({ boardId: board.id, title, background: board.background });
      toast.success(`Renamed board to "${updated.title}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleAddList = async (title: string) => {
    try {
      const list = await addList(board.id, title);
      toast.success(`Created list "${list.title}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleUpdateListTitle = async (listId: string, title: string) => {
    try {
      await updateListTitle(listId, title);
      toast.success("List renamed.");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteList = async (listId: string) => {
    const list = lists.find((l) => l.id === listId);

    try {
      await removeList(listId);
      toast.success(`Deleted list "${list?.title ?? "Untitled"}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleAddCard = async (listId: string, title: string) => {
    try {
      const card = await addCard(listId, title);
      toast.success(`Created card "${card.title}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleUpdateCard = async (cardId: string, input: CardUpdatePatch) => {
    try {
      await updateCard({ cardId, ...input });
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const card = lists.flatMap((list) => list.cards).find((item) => item.id === cardId);

    try {
      await removeCard(cardId);
      toast.success(`Deleted card "${card?.title ?? "Untitled"}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-3rem)] flex-1 flex-col overflow-hidden"
      style={{ background: background.cssBackground }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.26),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0)_18%,_rgba(15,23,42,0.08)_100%)]" />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <BoardHeader board={board} onUpdateTitle={handleUpdateBoardTitle} />

        <div className="relative min-h-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8 bg-gradient-to-r from-slate-950/12 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-gradient-to-l from-slate-950/12 to-transparent lg:block" />

          <div className="board-scrollbar relative min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-4 pb-5 pt-4 sm:px-5">
            <BoardDndContext lists={lists}>
              <div className="flex h-full min-w-max snap-x snap-proximity items-start gap-3 pb-2">
                {lists.map((list) => (
                  <SortableList
                    key={list.id}
                    list={list}
                    onUpdateTitle={(title) => handleUpdateListTitle(list.id, title)}
                    onDelete={() => handleDeleteList(list.id)}
                    onAddCard={(title) => handleAddCard(list.id, title)}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={handleDeleteCard}
                  />
                ))}
                <AddListButton onAdd={handleAddList} />
              </div>
            </BoardDndContext>
          </div>
        </div>
      </div>
    </div>
  );
}

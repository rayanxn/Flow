"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { getBoardBackground } from "@/lib/backgrounds";
import { sortByPosition } from "@/lib/fractional-index";
import type { BoardWithDetails } from "@/types";
import AddListButton from "@/components/list/AddListButton";
import ListColumn from "@/components/list/ListColumn";
import BoardHeader from "@/components/board/BoardHeader";
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

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] flex-col rounded-xl"
      style={{ background: background.cssBackground }}
    >
      <BoardHeader board={board} onUpdateTitle={handleUpdateBoardTitle} />

      <div className="flex flex-1 items-start gap-4 overflow-x-auto px-4 pb-4 pt-2">
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            onUpdateTitle={(title) => handleUpdateListTitle(list.id, title)}
            onDelete={() => handleDeleteList(list.id)}
          />
        ))}
        <AddListButton onAdd={handleAddList} />
      </div>
    </div>
  );
}

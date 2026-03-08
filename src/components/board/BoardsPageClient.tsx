"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Archive, Plus } from "lucide-react";
import { toast } from "sonner";

import { splitBoards } from "@/lib/boards";
import type { Board, BoardFormValues } from "@/types";
import BoardGrid from "@/components/board/BoardGrid";
import CreateBoardDialog from "@/components/board/CreateBoardDialog";
import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/store/boardStore";

interface BoardsPageClientProps {
  initialBoards: Board[];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while updating boards.";
}

export default function BoardsPageClient({ initialBoards }: BoardsPageClientProps) {
  const boards = useBoardStore((state) => state.boards);
  const archivedBoards = useBoardStore((state) => state.archivedBoards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const hasHydrated = useBoardStore((state) => state.hasHydrated);
  const error = useBoardStore((state) => state.error);
  const replaceBoardSnapshot = useBoardStore((state) => state.replaceBoardSnapshot);
  const createBoard = useBoardStore((state) => state.createBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const archiveBoard = useBoardStore((state) => state.archiveBoard);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const initialState = useMemo(() => splitBoards(initialBoards), [initialBoards]);

  useEffect(() => {
    replaceBoardSnapshot(initialBoards);
  }, [replaceBoardSnapshot, initialBoards]);

  const handleCreateBoard = async (values: BoardFormValues) => {
    try {
      const board = await createBoard(values);
      toast.success(`Created "${board.title}".`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateBoard = async (boardId: string, values: BoardFormValues) => {
    try {
      const board = await updateBoard({ boardId, ...values });
      toast.success(`Updated "${board.title}".`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const handleArchiveBoard = async (boardId: string) => {
    try {
      const board = await archiveBoard(boardId);
      toast.success(`Archived "${board.title}".`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const visibleBoards = hasHydrated ? boards : initialState.boards;
  const visibleArchivedBoards = hasHydrated ? archivedBoards : initialState.archivedBoards;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Boards</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create, rename, and archive boards without losing your work. Click a board to manage its
            lists and cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/archived">
              <Archive className="size-4" />
              Archived ({visibleArchivedBoards.length})
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Create board
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/70 px-4 py-3 text-sm text-muted-foreground sm:px-5">
        <span className="font-medium text-foreground">{visibleBoards.length}</span> active boards
        {visibleArchivedBoards.length > 0 ? (
          <>
            {" "}
            and <span className="font-medium text-foreground">{visibleArchivedBoards.length}</span>{" "}
            archived
          </>
        ) : null}
        .
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <BoardGrid
        boards={visibleBoards}
        isLoading={isLoading}
        emptyTitle="No boards yet"
        emptyDescription="Create your first board to start organizing work across lists and cards."
        emptyAction={{
          label: "Create board",
          onClick: () => setIsCreateOpen(true),
        }}
        onEdit={handleUpdateBoard}
        onArchive={handleArchiveBoard}
      />

      <CreateBoardDialog
        key={`create-board-${isCreateOpen ? "open" : "closed"}`}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateBoard}
        mode="create"
      />
    </div>
  );
}

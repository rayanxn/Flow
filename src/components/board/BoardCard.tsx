"use client";

import Link from "next/link";
import { useState } from "react";
import { Archive, MoreHorizontal, PencilLine, RotateCcw, Trash2 } from "lucide-react";

import { getBoardBackground } from "@/lib/backgrounds";
import type { Board, BoardFormValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateBoardDialog from "@/components/board/CreateBoardDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface BoardCardProps {
  board: Board;
  mode?: "active" | "archived";
  onEdit?: (boardId: string, values: BoardFormValues) => Promise<void>;
  onArchive?: (boardId: string) => Promise<void>;
  onRestore?: (boardId: string) => Promise<void>;
  onDelete?: (boardId: string) => Promise<void>;
}

function formatBoardTimestamp(timestamp: string | null) {
  if (!timestamp) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(timestamp));
}

export default function BoardCard({
  board,
  mode = "active",
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: BoardCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const background = getBoardBackground(board.background);
  const archiveLabel =
    mode === "archived"
      ? `Archived ${formatBoardTimestamp(board.archived_at ?? board.updated_at)}`
      : `Updated ${formatBoardTimestamp(board.updated_at)}`;

  return (
    <>
      <Card className="overflow-hidden border-border/70 py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        {mode === "active" ? (
          <Link href={`/boards/${board.id}`} className="block">
            <div
              className="h-28 w-full"
              style={{ background: background.cssBackground }}
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div
            className="h-28 w-full"
            style={{ background: background.cssBackground }}
            aria-hidden="true"
          />
        )}

        <CardContent className="space-y-4 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {mode === "active" ? (
                <Link href={`/boards/${board.id}`} className="block">
                  <h3 className="truncate text-lg font-semibold hover:underline">{board.title}</h3>
                </Link>
              ) : (
                <h3 className="truncate text-lg font-semibold">{board.title}</h3>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{archiveLabel}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Open actions for ${board.title}`}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {mode === "active" && onEdit ? (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setIsEditOpen(true);
                    }}
                  >
                    <PencilLine className="size-4" />
                    Edit board
                  </DropdownMenuItem>
                ) : null}

                {mode === "active" && onArchive ? (
                  <DropdownMenuItem
                    onSelect={() => {
                      void onArchive(board.id);
                    }}
                  >
                    <Archive className="size-4" />
                    Archive board
                  </DropdownMenuItem>
                ) : null}

                {mode === "archived" && onRestore ? (
                  <DropdownMenuItem
                    onSelect={() => {
                      void onRestore(board.id);
                    }}
                  >
                    <RotateCcw className="size-4" />
                    Restore board
                  </DropdownMenuItem>
                ) : null}

                {mode === "archived" && onDelete ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => {
                        event.preventDefault();
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="size-4" />
                      Delete permanently
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>

        <CardFooter className="border-t px-4 py-3 text-xs text-muted-foreground">
          <span>Background: {background.label}</span>
        </CardFooter>
      </Card>

      {onEdit ? (
        <CreateBoardDialog
          key={`${board.id}-${isEditOpen ? "open" : "closed"}`}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={(values) => onEdit(board.id, values)}
          initialValues={{
            title: board.title,
            background: board.background,
          }}
          mode="edit"
        />
      ) : null}

      {onDelete ? (
        <ConfirmDialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          title="Delete board permanently?"
          description={`"${board.title}" and everything inside it will be removed permanently.`}
          confirmLabel="Delete board"
          confirmVariant="destructive"
          onConfirm={async () => {
            await onDelete(board.id);
          }}
        />
      ) : null}
    </>
  );
}

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getBoardTitleError } from "@/lib/boards";
import type { Board } from "@/types";

interface BoardHeaderProps {
  board: Board;
  onUpdateTitle: (title: string) => Promise<void>;
}

export default function BoardHeader({ board, onUpdateTitle }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(board.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditValue(board.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const saveTitle = async () => {
    const trimmed = editValue.trim();

    if (!trimmed || trimmed === board.title) {
      setIsEditing(false);
      return;
    }

    const error = getBoardTitleError(trimmed);

    if (error) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdateTitle(trimmed);
    } finally {
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setEditValue(board.title);
    setIsEditing(false);
  };

  return (
    <div className="px-4 pb-2 pt-4">
      <Link
        href="/boards"
        className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Boards
      </Link>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={() => void saveTitle()}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void saveTitle();
            } else if (event.key === "Escape") {
              cancelEditing();
            }
          }}
          className="block w-full max-w-lg rounded border border-white/30 bg-white/10 px-2 py-1 text-2xl font-bold text-white outline-none backdrop-blur focus:ring-2 focus:ring-white/50"
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={startEditing}
          className="block cursor-pointer text-2xl font-bold text-white"
        >
          {board.title}
        </button>
      )}
    </div>
  );
}

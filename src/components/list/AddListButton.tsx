"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { getListTitleError } from "@/lib/lists";
import { Button } from "@/components/ui/button";

interface AddListButtonProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddListButton({ onAdd }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = title.trim();

    if (!trimmed || getListTitleError(trimmed)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdd(trimmed);
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setTitle("");
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsAdding(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex w-72 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/50"
      >
        <Plus className="size-4" />
        Add list
      </button>
    );
  }

  return (
    <div className="flex w-72 shrink-0 flex-col gap-2 rounded-xl border bg-muted/50 p-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            void handleSubmit();
          } else if (event.key === "Escape") {
            handleClose();
          }
        }}
        placeholder="Enter list title..."
        className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={isSubmitting} onClick={() => void handleSubmit()}>
          Add list
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

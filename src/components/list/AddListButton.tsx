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
        className="flex w-[272px] shrink-0 snap-start cursor-pointer items-center gap-2 rounded-xl border border-white/14 bg-white/16 px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:bg-white/24"
      >
        <Plus className="size-4" />
        Add another list
      </button>
    );
  }

  return (
    <div className="flex w-[272px] shrink-0 snap-start flex-col gap-2 rounded-xl bg-[#f1f2f4]/96 p-2.5 shadow-[0_1px_1px_rgba(15,23,42,0.12),0_10px_24px_rgba(15,23,42,0.14)] ring-1 ring-slate-950/6 backdrop-blur-sm">
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
        className="h-10 rounded-md border border-transparent bg-white px-3 text-sm font-medium text-slate-800 outline-none shadow-sm focus:border-slate-300 focus:ring-2 focus:ring-slate-300/80"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={() => void handleSubmit()}
          className="rounded-md bg-sky-600 text-white hover:bg-sky-700"
        >
          Add list
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:bg-slate-300/60 hover:text-slate-700"
          onClick={handleClose}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

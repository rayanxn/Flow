"use client";

import { useRef, useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { getCardTitleError } from "@/lib/cards";
import { Button } from "@/components/ui/button";

interface AddCardInputProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddCardInput({ onAdd }: AddCardInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || getCardTitleError(trimmedTitle)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdd(trimmedTitle);
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

  const handleTemplatesPlaceholder = () => {
    toast("Card templates land in a later phase.");
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsAdding(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-300/70 hover:text-slate-800"
      >
        <span className="flex items-center gap-2">
          <Plus className="size-4" />
          Add a card
        </span>
        <span
          role="presentation"
          className="inline-flex size-7 items-center justify-center rounded-full text-slate-400"
        >
          <Sparkles className="size-4" />
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-white p-2 shadow-[0_1px_1px_rgba(15,23,42,0.12),0_8px_20px_rgba(15,23,42,0.12)]">
      <textarea
        ref={inputRef}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void handleSubmit();
          } else if (event.key === "Escape") {
            handleClose();
          }
        }}
        rows={3}
        placeholder="Enter a title or paste a link..."
        className="w-full resize-none rounded-md border border-transparent bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-300/80"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={() => void handleSubmit()}
          className="rounded-md bg-sky-600 text-white hover:bg-sky-700"
        >
          Add card
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={handleClose}
        >
          <X className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          onClick={handleTemplatesPlaceholder}
        >
          <Sparkles className="size-4" />
          Template
        </Button>
      </div>
    </div>
  );
}

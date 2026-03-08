"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { getCardTitleError } from "@/lib/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddCardInputProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddCardInput({ onAdd }: AddCardInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsAdding(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
      >
        <Plus className="size-4" />
        Add a card
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
      <Input
        ref={inputRef}
        type="text"
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
        placeholder="Enter a title for this card..."
        autoFocus
      />
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={isSubmitting} onClick={() => void handleSubmit()}>
          Add card
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

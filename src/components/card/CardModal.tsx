"use client";

import { useEffect, useId, useMemo, useState } from "react";

import {
  formatCardDueDateInputValue,
  getCardTitleError,
} from "@/lib/cards";
import type { Card as CardRecord, CardUpdatePatch } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CardModalProps {
  card: CardRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (cardId: string, input: CardUpdatePatch) => Promise<void>;
  onDelete: (cardId: string) => Promise<void>;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export default function CardModal({
  card,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: CardModalProps) {
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [dueDateValue, setDueDateValue] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isSavingDueDate, setIsSavingDueDate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dueDateId = useId();

  useEffect(() => {
    if (!card) {
      return;
    }

    setTitleValue(card.title);
    setDescriptionValue(card.description ?? "");
    setDueDateValue(formatCardDueDateInputValue(card.due_date));
    setTitleError(null);
    setErrorMessage(null);
  }, [card]);

  const isBusy = useMemo(
    () => isSavingTitle || isSavingDescription || isSavingDueDate || isDeleting,
    [isDeleting, isSavingDescription, isSavingDueDate, isSavingTitle]
  );

  if (!card) {
    return null;
  }

  const saveTitle = async () => {
    const nextTitle = titleValue.trim();

    if (nextTitle === card.title) {
      setTitleError(null);
      return;
    }

    const nextTitleError = getCardTitleError(nextTitle);

    if (nextTitleError) {
      setTitleError(nextTitleError);
      return;
    }

    setIsSavingTitle(true);
    setTitleError(null);
    setErrorMessage(null);

    try {
      await onUpdate(card.id, { title: nextTitle });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSavingTitle(false);
    }
  };

  const saveDescription = async () => {
    if (descriptionValue === (card.description ?? "")) {
      return;
    }

    setIsSavingDescription(true);
    setErrorMessage(null);

    try {
      await onUpdate(card.id, { description: descriptionValue });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSavingDescription(false);
    }
  };

  const saveDueDate = async (nextDueDate: string) => {
    if (nextDueDate === formatCardDueDateInputValue(card.due_date)) {
      return;
    }

    setIsSavingDueDate(true);
    setErrorMessage(null);

    try {
      await onUpdate(card.id, { dueDate: nextDueDate || null });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setDueDateValue(formatCardDueDateInputValue(card.due_date));
    } finally {
      setIsSavingDueDate(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onDelete(card.id);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
          <DialogDescription>Changes are saved automatically as you edit.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor={titleId} className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              id={titleId}
              type="text"
              value={titleValue}
              onChange={(event) => {
                setTitleValue(event.target.value);
                if (titleError) {
                  setTitleError(null);
                }
              }}
              onBlur={() => void saveTitle()}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveTitle();
                } else if (event.key === "Escape") {
                  setTitleValue(card.title);
                  setTitleError(null);
                }
              }}
              disabled={isDeleting}
              aria-invalid={Boolean(titleError)}
            />
            {titleError ? <p className="text-sm text-destructive">{titleError}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor={descriptionId} className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id={descriptionId}
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              onBlur={() => void saveDescription()}
              rows={6}
              disabled={isDeleting}
              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add a more detailed description..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={dueDateId} className="text-sm font-medium text-foreground">
              Due date
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id={dueDateId}
                type="date"
                value={dueDateValue}
                onChange={(event) => {
                  const nextDueDate = event.target.value;

                  setDueDateValue(nextDueDate);
                  void saveDueDate(nextDueDate);
                }}
                disabled={isDeleting || isSavingDueDate}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!dueDateValue || isDeleting || isSavingDueDate}
                onClick={() => {
                  setDueDateValue("");
                  void saveDueDate("");
                }}
              >
                Clear date
              </Button>
            </div>
          </div>

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">{isBusy ? "Saving changes..." : "Saved."}</p>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleDelete()}
            >
              {isDeleting ? "Deleting..." : "Delete card"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

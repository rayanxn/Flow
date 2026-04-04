"use client";

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmLabel?: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
  confirmLabel = "Delete",
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-input bg-surface px-8 pt-8 pb-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex flex-col items-center gap-5">
            {/* Warning icon */}
            <div className="flex size-10 items-center justify-center rounded-full bg-danger-muted/10">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="7.5" stroke="var(--color-danger)" strokeWidth="1.5" />
                <path d="M9 5V10" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 12.5V13" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Title */}
            <DialogPrimitive.Title className="text-center text-[17px]/5.5 font-semibold text-text">
              {title}
            </DialogPrimitive.Title>

            {/* Description */}
            <DialogPrimitive.Description className="-mt-2 text-center text-[13px]/5 text-text-muted">
              {description}
            </DialogPrimitive.Description>

            {/* Buttons */}
            <div className="flex gap-2.5 pt-1 w-full">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 rounded-lg border border-border-input px-5 py-2.5 text-[13px] font-medium text-text transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-lg bg-danger-muted px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-danger-muted-hover disabled:opacity-50"
              >
                {loading ? "Deleting..." : confirmLabel}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

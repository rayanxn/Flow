"use client";

import { AlertCircle } from "lucide-react";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="size-12 rounded-full bg-[#8B404918] flex items-center justify-center mb-4">
        <AlertCircle className="size-6 text-[#C45A3C]" />
      </div>
      <h2 className="text-[17px] font-semibold text-text mb-1">
        Something went wrong
      </h2>
      <p className="text-[13px] text-text-muted mb-6 text-center max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg py-2.5 px-6 bg-[#2E2E2C] text-white text-[13px] font-medium hover:bg-[#1E1E1C] transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg py-2.5 px-6 border border-[#2E2E2C14] text-[13px] font-medium text-text hover:bg-[#F6F5F1] transition-colors"
        >
          Go to dashboard
        </a>
      </div>
    </div>
  );
}

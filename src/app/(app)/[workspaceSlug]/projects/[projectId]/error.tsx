"use client";

import { AlertCircle } from "lucide-react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-danger-muted/10">
        <AlertCircle className="size-6 text-danger" />
      </div>
      <h2 className="text-[17px] font-semibold text-text mb-1">
        Failed to load project
      </h2>
      <p className="text-[13px] text-text-muted mb-6 text-center max-w-sm">
        {error.message || "Something went wrong loading this project."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}

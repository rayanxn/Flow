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
      <div className="size-12 rounded-full bg-[#8B404918] flex items-center justify-center mb-4">
        <AlertCircle className="size-6 text-[#C45A3C]" />
      </div>
      <h2 className="text-[17px] font-semibold text-text mb-1">
        Failed to load project
      </h2>
      <p className="text-[13px] text-text-muted mb-6 text-center max-w-sm">
        {error.message || "Something went wrong loading this project."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg py-2.5 px-6 bg-[#2E2E2C] text-white text-[13px] font-medium hover:bg-[#1E1E1C] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-text">Something went wrong</h1>
        <p className="mt-2 text-text-secondary">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-block cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

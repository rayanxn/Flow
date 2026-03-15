"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function BoardErrorPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-600">
        An unexpected error occurred while loading this board.
      </p>
      <Button asChild variant="outline">
        <Link href="/boards">Back to boards</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function BoardNotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Board not found</h1>
      <p className="text-slate-600">
        This board doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild variant="outline">
        <Link href="/boards">Back to boards</Link>
      </Button>
    </div>
  );
}

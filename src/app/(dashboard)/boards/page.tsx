import { KanbanSquare, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BoardsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Boards</h1>
        <Button disabled>
          <Plus className="size-4" />
          Create board
        </Button>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <KanbanSquare className="size-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-medium">No boards yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first board to get started.
        </p>
        <Button className="mt-6" disabled>
          <Plus className="size-4" />
          Create board
        </Button>
      </div>
    </div>
  );
}

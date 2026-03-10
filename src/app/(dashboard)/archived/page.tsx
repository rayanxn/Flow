import ArchivedBoardsPageClient from "@/components/board/ArchivedBoardsPageClient";
import { listBoards } from "@/lib/board-queries";
import { createClient } from "@/lib/supabase/server";

export default async function ArchivedBoardsPage() {
  const supabase = await createClient();
  const boards = await listBoards(supabase);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ArchivedBoardsPageClient initialBoards={boards} />
    </div>
  );
}

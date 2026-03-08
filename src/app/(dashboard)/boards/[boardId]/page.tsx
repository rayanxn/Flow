import { notFound } from "next/navigation";

import BoardDetailClient from "@/components/board/BoardDetailClient";
import { getBoardWithLists } from "@/lib/list-queries";
import { createClient } from "@/lib/supabase/server";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const supabase = await createClient();
  const board = await getBoardWithLists(supabase, boardId);

  if (!board || board.is_archived) {
    notFound();
  }

  return <BoardDetailClient initialBoard={board} />;
}

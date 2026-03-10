import { notFound } from "next/navigation";

import BoardDetailClient from "@/components/board/BoardDetailClient";
import { getBoardWithLists } from "@/lib/list-queries";
import { getBoardParticipants, getBoardInvitations } from "@/lib/member-queries";
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const [participants, invitations] = await Promise.all([
    getBoardParticipants(supabase, boardId),
    getBoardInvitations(supabase, boardId),
  ]);

  return (
    <BoardDetailClient
      initialBoard={board}
      initialParticipants={participants}
      initialInvitations={invitations}
      currentUserId={user.id}
    />
  );
}

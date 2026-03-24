import { createClient } from "@/lib/supabase/server";

export type TeamMemberWithProfile = {
  id: string;
  user_id: string;
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  activeTaskCount: number;
};

export type TeamWithMembers = {
  id: string;
  name: string;
  workspace_id: string;
  members: TeamMemberWithProfile[];
  activeIssueCount: number;
};

export async function getTeamsWithMembers(
  workspaceId: string
): Promise<TeamWithMembers[]> {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");

  if (!teams || teams.length === 0) return [];

  // Batch-fetch team members
  const teamIds = teams.map((t) => t.id);
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .in("team_id", teamIds);

  if (!teamMembers || teamMembers.length === 0) {
    return teams.map((t) => ({
      id: t.id,
      name: t.name,
      workspace_id: t.workspace_id,
      members: [],
      activeIssueCount: 0,
    }));
  }

  // Batch-fetch profiles
  const userIds = [...new Set(teamMembers.map((tm) => tm.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", userIds);

  const profileMap = new Map<
    string,
    { id: string; full_name: string | null; email: string; avatar_url: string | null }
  >();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p);
  }

  // Batch-fetch active issue counts per user
  const { data: issues } = await supabase
    .from("issues")
    .select("assignee_id")
    .eq("workspace_id", workspaceId)
    .neq("status", "done")
    .in("assignee_id", userIds);

  const taskCountMap = new Map<string, number>();
  for (const issue of issues ?? []) {
    if (issue.assignee_id) {
      taskCountMap.set(
        issue.assignee_id,
        (taskCountMap.get(issue.assignee_id) ?? 0) + 1
      );
    }
  }

  // Group team members by team
  const membersByTeam = new Map<string, TeamMemberWithProfile[]>();
  for (const tm of teamMembers) {
    const profile = profileMap.get(tm.user_id);
    if (!profile) continue;

    if (!membersByTeam.has(tm.team_id)) {
      membersByTeam.set(tm.team_id, []);
    }
    membersByTeam.get(tm.team_id)!.push({
      id: tm.id,
      user_id: tm.user_id,
      profile,
      activeTaskCount: taskCountMap.get(tm.user_id) ?? 0,
    });
  }

  return teams.map((t) => {
    const members = membersByTeam.get(t.id) ?? [];
    return {
      id: t.id,
      name: t.name,
      workspace_id: t.workspace_id,
      members,
      activeIssueCount: members.reduce((sum, m) => sum + m.activeTaskCount, 0),
    };
  });
}

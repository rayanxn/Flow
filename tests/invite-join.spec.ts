import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OWNER_EMAIL = `owner-${Date.now()}@test.flow.dev`;
const INVITEE_EMAIL = `invitee-${Date.now()}@test.flow.dev`;
const TEST_PASSWORD = "testpassword123";
const OWNER_NAME = "Invite Owner";
const INVITEE_NAME = "Invitee User";
const INVITED_WORKSPACE_NAME = `Invite Workspace ${Date.now()}`;
const INVITED_WORKSPACE_SLUG = `invite-ws-${Date.now()}`;
const EXISTING_WORKSPACE_NAME = `Existing Workspace ${Date.now()}`;
const EXISTING_WORKSPACE_SLUG = `existing-ws-${Date.now()}`;

let admin: SupabaseClient<Database>;
let ownerId: string | null = null;
let inviteeId: string | null = null;
let invitedWorkspaceId: string | null = null;
let existingWorkspaceId: string | null = null;
let inviteCode: string | null = null;

test.use({ storageState: { cookies: [], origins: [] } });

test.describe.serial("invite redemption", () => {
  test.beforeAll(async () => {
    admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: ownerData, error: ownerError } = await admin.auth.admin.createUser({
      email: OWNER_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: OWNER_NAME },
    });

    if (ownerError) {
      throw new Error(`Failed to create owner: ${ownerError.message}`);
    }

    ownerId = ownerData.user.id;

    const { data: inviteeData, error: inviteeError } = await admin.auth.admin.createUser({
      email: INVITEE_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: INVITEE_NAME },
    });

    if (inviteeError) {
      throw new Error(`Failed to create invitee: ${inviteeError.message}`);
    }

    inviteeId = inviteeData.user.id;

    const { data: createdInvitedWorkspace, error: invitedWorkspaceError } = await admin
      .from("workspaces")
      .insert({
        name: INVITED_WORKSPACE_NAME,
        slug: INVITED_WORKSPACE_SLUG,
      })
      .select("id")
      .single();

    if (invitedWorkspaceError) {
      throw new Error(`Failed to create invited workspace: ${invitedWorkspaceError.message}`);
    }

    invitedWorkspaceId = createdInvitedWorkspace.id;

    const { data: createdExistingWorkspace, error: existingWorkspaceError } = await admin
      .from("workspaces")
      .insert({
        name: EXISTING_WORKSPACE_NAME,
        slug: EXISTING_WORKSPACE_SLUG,
      })
      .select("id")
      .single();

    if (existingWorkspaceError) {
      throw new Error(`Failed to create existing workspace: ${existingWorkspaceError.message}`);
    }

    existingWorkspaceId = createdExistingWorkspace.id;

    const { error: membershipError } = await admin.from("workspace_members").insert([
      {
        workspace_id: invitedWorkspaceId,
        user_id: ownerId,
        role: "owner",
      },
      {
        workspace_id: existingWorkspaceId,
        user_id: inviteeId,
        role: "owner",
      },
    ]);

    if (membershipError) {
      throw new Error(`Failed to create memberships: ${membershipError.message}`);
    }

    const { data: invite, error: inviteError } = await admin
      .from("workspace_invites")
      .insert({
        workspace_id: invitedWorkspaceId,
        invite_type: "email",
        email: INVITEE_EMAIL,
        role: "member",
        created_by: ownerId,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("code")
      .single();

    if (inviteError || !invite) {
      throw new Error(`Failed to create invite: ${inviteError?.message ?? "missing invite"}`);
    }

    inviteCode = invite.code;
  });

  test.afterAll(async () => {
    if (invitedWorkspaceId) {
      await admin.from("workspace_invites").delete().eq("workspace_id", invitedWorkspaceId);
      await admin.from("workspace_members").delete().eq("workspace_id", invitedWorkspaceId);
      await admin.from("workspaces").delete().eq("id", invitedWorkspaceId);
    }

    if (existingWorkspaceId) {
      await admin.from("workspace_members").delete().eq("workspace_id", existingWorkspaceId);
      await admin.from("workspaces").delete().eq("id", existingWorkspaceId);
    }

    if (ownerId) {
      await admin.from("profiles").delete().eq("id", ownerId);
      await admin.auth.admin.deleteUser(ownerId);
    }

    if (inviteeId) {
      await admin.from("profiles").delete().eq("id", inviteeId);
      await admin.auth.admin.deleteUser(inviteeId);
    }
  });

  test("logged-out invitee signs in, returns to the invite, and keeps existing memberships", async ({
    page,
  }) => {
    if (!inviteCode) {
      throw new Error("Invite code was not created");
    }

    await page.goto(`/join/${inviteCode}`);

    await expect(
      page.getByRole("heading", { name: `Join ${INVITED_WORKSPACE_NAME}` })
    ).toBeVisible({ timeout: 10000 });

    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login\?next=/, { timeout: 10000 });

    await page.getByLabel(/email/i).fill(INVITEE_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(new RegExp(`/join/${inviteCode}`), {
      timeout: 15000,
    });
    await expect(page.getByRole("button", { name: "Join workspace" })).toBeVisible();

    await page.getByRole("button", { name: "Join workspace" }).click();

    await expect(page).toHaveURL(new RegExp(`/${INVITED_WORKSPACE_SLUG}/dashboard`), {
      timeout: 15000,
    });

    await page.getByRole("button", { name: "Open account menu" }).click();
    await expect(
      page.getByRole("menuitem", { name: new RegExp(EXISTING_WORKSPACE_NAME) })
    ).toBeVisible();
  });
});

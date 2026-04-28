#!/usr/bin/env npx tsx

/**
 * Deletes expired guest workspaces and anonymous auth users.
 *
 * Usage:
 *   npx tsx scripts/cleanup-guest-workspaces.ts
 */

import dotenv from "dotenv";
import path from "node:path";
import { cleanupExpiredGuestWorkspaces } from "../src/lib/guest/cleanup";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const result = await cleanupExpiredGuestWorkspaces();

  console.log(
    [
      `Scanned: ${result.scanned}`,
      `Deleted workspaces: ${result.deletedWorkspaces}`,
      `Deleted auth users: ${result.deletedAuthUsers}`,
      `Skipped auth users: ${result.skippedAuthUsers}`,
      `Errors: ${result.errors.length}`,
    ].join("\n"),
  );

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

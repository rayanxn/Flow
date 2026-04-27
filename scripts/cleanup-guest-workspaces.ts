#!/usr/bin/env npx tsx

import dotenv from "dotenv";
import path from "node:path";
import { cleanupExpiredGuestWorkspaces } from "../src/lib/guest/cleanup";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const result = await cleanupExpiredGuestWorkspaces();

  console.log(
    [
      `scanned=${result.scanned}`,
      `deletedWorkspaces=${result.deletedWorkspaces}`,
      `deletedUsers=${result.deletedUsers}`,
      `skippedUsers=${result.skippedUsers}`,
      `markedCleaned=${result.markedCleaned}`,
    ].join(" "),
  );

  if (result.errors.length > 0) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

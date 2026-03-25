"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { IssueWithDetails } from "@/lib/queries/issues";

/**
 * Reads the `?issue=ISSUE-KEY` search param on mount and calls `onOpen`
 * with the matching issue. This enables shareable permalink URLs.
 */
export function useIssueFromUrl(
  issues: IssueWithDetails[],
  onOpen: (issue: IssueWithDetails) => void
) {
  const searchParams = useSearchParams();
  const didAutoOpen = useRef(false);
  const issueKey = searchParams.get("issue");

  useEffect(() => {
    if (!issueKey || didAutoOpen.current) return;
    const match = issues.find((i) => i.issue_key === issueKey);
    if (match) {
      didAutoOpen.current = true;
      onOpen(match);
    }
  }, [issueKey, issues, onOpen]);
}

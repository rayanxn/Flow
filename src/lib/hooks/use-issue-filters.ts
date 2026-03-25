"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { parseFiltersFromParams, filtersToParams } from "@/lib/utils/filters";
import { useHotkeys } from "./use-hotkeys";
import type { ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";

export type FilterCategory = "status" | "priority" | "assignee" | "label" | "project";

interface UseIssueFiltersOptions {
  issues: IssueWithDetails[];
  enabledFilters?: FilterCategory[];
}

export function useIssueFilters({ issues, enabledFilters }: UseIssueFiltersOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse initial filters from URL
  const filters = useMemo(() => {
    const raw: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      raw[key] = value;
    });
    return parseFiltersFromParams(raw);
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState("");

  // Write filters to URL
  const updateFilters = useCallback(
    (next: ViewFilters) => {
      const params = filtersToParams(next);
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname],
  );

  const toggleFilter = useCallback(
    (key: keyof ViewFilters, value: string) => {
      const next = { ...filters };

      if (key === "status") {
        const arr = [...(next.status ?? [])];
        const v = value as IssueStatus;
        const idx = arr.indexOf(v);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(v);
        next.status = arr.length ? arr : undefined;
      } else if (key === "priority") {
        const arr = [...(next.priority ?? [])];
        const v = Number(value) as IssuePriority;
        const idx = arr.indexOf(v);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(v);
        next.priority = arr.length ? arr : undefined;
      } else if (key === "assignee_ids") {
        const arr = [...(next.assignee_ids ?? [])];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        next.assignee_ids = arr.length ? arr : undefined;
      } else if (key === "label_ids") {
        const arr = [...(next.label_ids ?? [])];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        next.label_ids = arr.length ? arr : undefined;
      } else if (key === "project_ids") {
        const arr = [...(next.project_ids ?? [])];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        next.project_ids = arr.length ? arr : undefined;
      }

      updateFilters(next);
    },
    [filters, updateFilters],
  );

  const clearFilter = useCallback(
    (key: keyof ViewFilters) => {
      const next = { ...filters };
      delete next[key];
      updateFilters(next);
    },
    [filters, updateFilters],
  );

  const clearAll = useCallback(() => {
    setSearchQuery("");
    updateFilters({});
  }, [updateFilters]);

  // Filtering logic: AND across categories, OR within each category
  const filteredIssues = useMemo(() => {
    let result = issues;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.issue_key.toLowerCase().includes(q),
      );
    }

    if (filters.status?.length) {
      const set = new Set(filters.status);
      result = result.filter((i) => set.has(i.status as IssueStatus));
    }

    if (filters.priority?.length) {
      const set = new Set(filters.priority);
      result = result.filter((i) => set.has(i.priority as IssuePriority));
    }

    if (filters.assignee_ids?.length) {
      const set = new Set(filters.assignee_ids);
      result = result.filter((i) => i.assignee?.id && set.has(i.assignee.id));
    }

    if (filters.label_ids?.length) {
      const set = new Set(filters.label_ids);
      result = result.filter((i) =>
        i.labels.some((l) => set.has(l.id)),
      );
    }

    if (filters.project_ids?.length) {
      const set = new Set(filters.project_ids);
      result = result.filter((i) => i.project?.id && set.has(i.project.id));
    }

    return result;
  }, [issues, searchQuery, filters]);

  const hasActiveFilters =
    searchQuery !== "" ||
    !!(filters.status?.length) ||
    !!(filters.priority?.length) ||
    !!(filters.assignee_ids?.length) ||
    !!(filters.label_ids?.length) ||
    !!(filters.project_ids?.length);

  // Build a filter function for BoardView's issueFilter prop
  const issueFilterFn = useMemo(() => {
    if (!hasActiveFilters) return undefined;
    return (issue: IssueWithDetails): boolean => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !issue.title.toLowerCase().includes(q) &&
          !issue.issue_key.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.status?.length) {
        if (!filters.status.includes(issue.status as IssueStatus)) return false;
      }
      if (filters.priority?.length) {
        if (!filters.priority.includes(issue.priority as IssuePriority)) return false;
      }
      if (filters.assignee_ids?.length) {
        if (!issue.assignee?.id || !filters.assignee_ids.includes(issue.assignee.id))
          return false;
      }
      if (filters.label_ids?.length) {
        if (!issue.labels.some((l) => filters.label_ids!.includes(l.id))) return false;
      }
      if (filters.project_ids?.length) {
        if (!issue.project?.id || !filters.project_ids.includes(issue.project.id))
          return false;
      }
      return true;
    };
  }, [hasActiveFilters, searchQuery, filters]);

  // F hotkey to focus search
  useHotkeys(
    useMemo(
      () => [
        {
          key: "f",
          handler: () => {
            searchInputRef.current?.focus();
          },
        },
      ],
      [],
    ),
  );

  return {
    filters,
    searchQuery,
    setSearchQuery,
    toggleFilter,
    clearFilter,
    clearAll,
    filteredIssues,
    hasActiveFilters,
    issueFilterFn,
    searchInputRef,
    enabledFilters,
  };
}

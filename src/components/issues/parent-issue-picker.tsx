"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  searchParentIssuesClient,
  type ParentIssueSearchResult,
} from "@/lib/queries/search";

interface ParentIssuePickerProps {
  projectId?: string;
  value: ParentIssueSearchResult | null;
  onChange: (value: ParentIssueSearchResult | null) => void;
  excludeIssueId?: string;
  disabled?: boolean;
  placeholder?: string;
  emptyMessage?: string;
}

export function ParentIssuePicker({
  projectId,
  value,
  onChange,
  excludeIssueId,
  disabled = false,
  placeholder = "Search issues...",
  emptyMessage = "No matching parent issues",
}: ParentIssuePickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParentIssueSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const searchDisabled = disabled || !projectId;
  const searchPlaceholder = disabled
    ? "Parent selection unavailable"
    : projectId
      ? placeholder
      : "Select a project first";

  const cancelPendingSearch = useCallback(() => {
    requestIdRef.current += 1;
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, []);

  const resetSearchState = useCallback(() => {
    cancelPendingSearch();
    setLoading(false);
    setResults([]);
  }, [cancelPendingSearch]);

  const queueSearch = useCallback((nextQuery: string) => {
    if (searchDisabled || !projectId) {
      return;
    }

    cancelPendingSearch();
    setLoading(true);

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    searchTimeoutRef.current = window.setTimeout(() => {
      searchTimeoutRef.current = null;

      searchParentIssuesClient(projectId, nextQuery, { excludeIssueId })
        .then((items) => {
          if (requestId !== requestIdRef.current) return;
          setResults(items);
          setLoading(false);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setResults([]);
          setLoading(false);
        });
    }, 150);
  }, [cancelPendingSearch, excludeIssueId, projectId, searchDisabled]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        resetSearchState();
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [resetSearchState]);

  useEffect(() => {
    return () => {
      cancelPendingSearch();
    };
  }, [cancelPendingSearch]);

  return (
    <div ref={rootRef} className="space-y-2">
      {value && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-hover/60 px-3 py-2">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-text-muted">
              {value.issue_key}
            </div>
            <div className="truncate text-sm text-text">
              {value.title}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
              resetSearchState();
            }}
            className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-surface hover:text-text"
            aria-label="Clear parent issue"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
        <Input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setOpen(true);
            queueSearch(nextQuery);
          }}
          onFocus={() => {
            if (!searchDisabled) {
              setOpen(true);
              queueSearch(query);
            }
          }}
          placeholder={searchPlaceholder}
          disabled={searchDisabled}
          className="h-9 pl-8 pr-9 text-xs"
        />
        {loading && (
          <LoaderCircle className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-text-muted" />
        )}
      </div>

      {open && !searchDisabled && (
        <div className="rounded-lg border border-border bg-surface shadow-lg">
          {results.length > 0 ? (
            <div className="max-h-56 overflow-y-auto p-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    onChange(result);
                    setQuery("");
                    resetSearchState();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors hover:bg-surface-hover",
                    value?.id === result.id && "bg-surface-hover",
                  )}
                >
                  <span className="text-[11px] font-mono text-text-muted">
                    {result.issue_key}
                  </span>
                  <span className="line-clamp-1 text-sm text-text">
                    {result.title}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-xs text-text-muted">
              {loading ? "Searching..." : emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

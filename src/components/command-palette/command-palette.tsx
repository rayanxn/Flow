"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command } from "cmdk";
import { PlusCircle, Search, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  searchIssuesClient,
  getRecentIssuesClient,
  type SearchResult,
} from "@/lib/queries/search";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceSlug: string;
  workspaceId: string;
  userId: string;
  projects: { id: string; name: string; color: string }[];
  onCreateIssue?: () => void;
}

function KBD({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center justify-center rounded-sm border border-border-input bg-surface-inset px-1.5 py-0.5">
      <span className="font-mono text-[10px] font-medium leading-[14px] text-text-muted">
        {children}
      </span>
    </span>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  workspaceSlug,
  workspaceId,
  userId,
  projects,
  onCreateIssue,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentItems, setRecentItems] = useState<SearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!open) return;

    const resetTimer = window.setTimeout(() => {
      setQuery("");
      setResults([]);
    }, 0);

    let cancelled = false;

    getRecentIssuesClient(workspaceId, userId, 3).then((items) => {
      if (!cancelled) {
        setRecentItems(items);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(resetTimer);
    };
  }, [open, workspaceId, userId]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchIssuesClient(workspaceId, query, 5).then(setResults);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, workspaceId]);

  const navigateToIssue = useCallback(
    (issue: SearchResult) => {
      if (issue.project) {
        router.push(`/${workspaceSlug}/projects/${issue.project.id}/board`);
      }
      onOpenChange(false);
    },
    [router, workspaceSlug, onOpenChange],
  );

  const navigateToProject = useCallback(
    (projectId: string) => {
      router.push(`/${workspaceSlug}/projects/${projectId}/board`);
      onOpenChange(false);
    },
    [router, workspaceSlug, onOpenChange],
  );

  const displayItems = query.trim() ? results : recentItems;
  const sectionLabel = query.trim() ? "RESULTS" : "RECENT";

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("");
        setResults([]);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={handleOpenChange}
      label="Command palette"
      className="fixed inset-0 z-50"
      shouldFilter={false}
    >
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={() => handleOpenChange(false)}
      />

      <div className="fixed left-1/2 top-4 flex max-h-[calc(100vh-2rem)] w-[min(640px,calc(100vw-1rem))] -translate-x-1/2 flex-col overflow-hidden rounded-[18px] border border-border-input bg-surface shadow-2xl sm:top-[180px] sm:max-h-[unset] sm:rounded-[14px]">
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-text-muted opacity-60" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search issues, projects, actions..."
            className="flex-1 bg-transparent text-[15px] leading-5 text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <Command.List className="flex max-h-[min(360px,calc(100vh-10.5rem))] flex-col overflow-y-auto p-2 sm:max-h-[360px]">
          {displayItems.length > 0 && (
            <Command.Group
              heading={
                <span className="block px-3 pb-1.5 pt-2 font-mono text-[10px] leading-3 tracking-[0.08em] text-text-muted opacity-60">
                  {sectionLabel}
                </span>
              }
            >
              {displayItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`issue-${item.id}`}
                  onSelect={() => navigateToIssue(item)}
                  className="cursor-pointer rounded-lg px-3 py-2.5 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 font-mono text-[11px] leading-[14px] text-text-muted opacity-60">
                        {item.issue_key}
                      </span>
                      <span className="truncate text-[13px] font-medium leading-4 text-text">
                        {item.title}
                      </span>
                    </div>
                    {item.project && (
                      <div className="flex items-center gap-1.5 pl-6 sm:pl-0">
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.project.color }}
                        />
                        <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">
                          {item.project.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {!query.trim() && (
            <>
              <div className="my-0.5 h-px w-full bg-border-subtle" />

              <Command.Group
                heading={
                  <span className="block px-3 pb-1.5 pt-2.5 font-mono text-[10px] leading-3 tracking-[0.08em] text-text-muted opacity-60">
                    ACTIONS
                  </span>
                }
              >
                <Command.Item
                  value="create-issue"
                  onSelect={() => {
                    onOpenChange(false);
                    onCreateIssue?.();
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2.5 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <PlusCircle className="h-4 w-4 text-text-muted opacity-60" />
                      <span className="text-[13px] font-medium leading-4 text-text">
                        Create new issue
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pl-6 sm:pl-0">
                      <KBD>⌘</KBD>
                      <KBD>N</KBD>
                    </div>
                  </div>
                </Command.Item>

                <Command.Item
                  value="go-to-settings"
                  onSelect={() => {
                    router.push(`/${workspaceSlug}/settings/general`);
                    onOpenChange(false);
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2.5 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <Settings2 className="h-4 w-4 text-text-muted opacity-60" />
                      <span className="text-[13px] font-medium leading-4 text-text">
                        Go to settings
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pl-6 sm:pl-0">
                      <KBD>⌘</KBD>
                      <KBD>,</KBD>
                    </div>
                  </div>
                </Command.Item>

                {projects.map((project) => (
                  <Command.Item
                    key={project.id}
                    value={`project-${project.name}`}
                    onSelect={() => navigateToProject(project.id)}
                    className="cursor-pointer rounded-lg px-3 py-2.5 data-[selected=true]:bg-surface-hover"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-[13px] font-medium leading-4 text-text">
                        {project.name}
                      </span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}

          {query.trim() && results.length === 0 && (
            <Command.Empty className="py-6 text-center text-[13px] text-text-muted">
              No results found.
            </Command.Empty>
          )}
        </Command.List>

        <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset px-1 py-px">
              <span className="font-mono text-[9px] font-medium leading-[14px] text-text-muted">↑↓</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset px-1 py-px">
              <span className="font-mono text-[9px] font-medium leading-[14px] text-text-muted">↵</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Open</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset px-1 py-px">
              <span className="font-mono text-[9px] font-medium leading-[14px] text-text-muted">esc</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Close</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

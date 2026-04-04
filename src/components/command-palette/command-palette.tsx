"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command } from "cmdk";
import { PlusCircle, Search, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchIssuesClient, getRecentIssuesClient, type SearchResult } from "@/lib/queries/search";

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
    <span className="flex items-center justify-center rounded-sm border border-border-input bg-surface-inset py-0.5 px-1.5">
      <span className="font-mono text-[10px] leading-[14px] font-medium text-text-muted">
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

  // Load recent items on open
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

  // Debounced search
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

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      className="fixed inset-0 z-50"
      shouldFilter={false}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette card */}
      <div className="fixed left-1/2 top-[180px] flex w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-[14px] border border-border-input bg-surface shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3.5 border-b border-border-subtle py-4 px-5">
          <Search className="h-[18px] w-[18px] shrink-0 text-text-muted opacity-60" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search issues, projects, actions..."
            className="flex-1 bg-transparent text-[15px] leading-5 text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>

        {/* Results */}
        <Command.List className="flex max-h-[360px] flex-col overflow-y-auto p-2">
          {/* Issues section */}
          {displayItems.length > 0 && (
            <Command.Group
              heading={
                <span className="block px-3 pt-2 pb-1.5 font-mono text-[10px] leading-3 tracking-[0.08em] text-text-muted opacity-60">
                  {sectionLabel}
                </span>
              }
            >
              {displayItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`issue-${item.id}`}
                  onSelect={() => navigateToIssue(item)}
                  className="flex cursor-pointer items-center justify-between rounded-lg py-2.5 px-3 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] leading-[14px] text-text-muted opacity-60">
                      {item.issue_key}
                    </span>
                    <span className="text-[13px] leading-4 font-medium text-text">
                      {item.title}
                    </span>
                  </div>
                  {item.project && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="rounded-full size-1.5 shrink-0"
                        style={{ backgroundColor: item.project.color }}
                      />
                      <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">
                        {item.project.name}
                      </span>
                    </div>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Divider */}
          {!query.trim() && (
            <>
              <div className="my-0.5 h-px w-full bg-border-subtle" />

              {/* Actions section */}
              <Command.Group
                heading={
                  <span className="block px-3 pt-2.5 pb-1.5 font-mono text-[10px] leading-3 tracking-[0.08em] text-text-muted opacity-60">
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
                  className="flex cursor-pointer items-center justify-between rounded-lg py-2.5 px-3 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="h-4 w-4 text-text-muted opacity-60" />
                    <span className="text-[13px] leading-4 font-medium text-text">
                      Create new issue
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <KBD>⌘</KBD>
                    <KBD>N</KBD>
                  </div>
                </Command.Item>

                <Command.Item
                  value="go-to-settings"
                  onSelect={() => {
                    router.push(`/${workspaceSlug}/settings/general`);
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg py-2.5 px-3 data-[selected=true]:bg-surface-hover"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings2 className="h-4 w-4 text-text-muted opacity-60" />
                    <span className="text-[13px] leading-4 font-medium text-text">
                      Go to settings
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <KBD>⌘</KBD>
                    <KBD>,</KBD>
                  </div>
                </Command.Item>

                {/* Project switching */}
                {projects.map((project) => (
                  <Command.Item
                    key={project.id}
                    value={`project-${project.name}`}
                    onSelect={() => navigateToProject(project.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg py-2.5 px-3 data-[selected=true]:bg-surface-hover"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="rounded-full size-2 shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-[13px] leading-4 font-medium text-text">
                        {project.name}
                      </span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}

          {/* Empty state */}
          {query.trim() && results.length === 0 && (
            <Command.Empty className="py-6 text-center text-[13px] text-text-muted">
              No results found.
            </Command.Empty>
          )}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border-subtle py-2.5 px-5">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset py-px px-1">
              <span className="font-mono text-[9px] leading-[14px] font-medium text-text-muted">↑↓</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset py-px px-1">
              <span className="font-mono text-[9px] leading-[14px] font-medium text-text-muted">↵</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Open</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] border border-border-input bg-surface-inset py-px px-1">
              <span className="font-mono text-[9px] leading-[14px] font-medium text-text-muted">esc</span>
            </span>
            <span className="font-mono text-[10px] leading-3 text-text-muted opacity-60">Close</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

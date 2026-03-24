"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command } from "cmdk";
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
    <span className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-[#2E2E2C0F]">
      <span className="text-[#A3A39E] font-mono font-medium text-[10px] leading-[14px]">
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
    if (open) {
      setQuery("");
      setResults([]);
      getRecentIssuesClient(workspaceId, userId, 3).then(setRecentItems);
    }
  }, [open, workspaceId, userId]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
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
        className="fixed inset-0 bg-[#2E2E2C73]"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette card */}
      <div className="fixed left-1/2 top-[180px] -translate-x-1/2 w-[640px] flex flex-col rounded-[14px] overflow-hidden bg-white border border-[#2E2E2C14] shadow-[0px_24px_64px_#2E2E2C33,0px_2px_8px_#2E2E2C0F]">
        {/* Search input */}
        <div className="flex items-center py-4 px-5 gap-3.5 border-b border-[#2E2E2C0F]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 opacity-30">
            <circle cx="8" cy="8" r="5.5" stroke="#2E2E2C" strokeWidth="1.5" />
            <path d="M12 12L16 16" stroke="#2E2E2C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search issues, projects, actions..."
            className="flex-1 bg-transparent text-[15px] leading-5 text-[#2E2E2C] placeholder:text-[#2E2E2C] placeholder:opacity-30 focus:outline-none"
          />
        </div>

        {/* Results */}
        <Command.List className="flex flex-col p-2 max-h-[360px] overflow-y-auto">
          {/* Issues section */}
          {displayItems.length > 0 && (
            <Command.Group
              heading={
                <span className="tracking-[0.08em] opacity-50 text-[#A3A39E] font-mono font-medium text-[10px] leading-3 px-3 pt-2 pb-1.5 block">
                  {sectionLabel}
                </span>
              }
            >
              {displayItems.map((item, i) => (
                <Command.Item
                  key={item.id}
                  value={`issue-${item.id}`}
                  onSelect={() => navigateToIssue(item)}
                  className="flex items-center justify-between rounded-lg py-2.5 px-3 cursor-pointer data-[selected=true]:bg-[#F6F5F1]"
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-50 text-[#A3A39E] font-mono text-[11px] leading-[14px]">
                      {item.issue_key}
                    </span>
                    <span className="text-[#2E2E2C] font-medium text-[13px] leading-4">
                      {item.title}
                    </span>
                  </div>
                  {item.project && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="rounded-full size-1.5 shrink-0"
                        style={{ backgroundColor: item.project.color }}
                      />
                      <span className="opacity-50 text-[#A3A39E] font-mono text-[10px] leading-3">
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
              <div className="w-full h-px bg-[#2E2E2C0F] my-0.5" />

              {/* Actions section */}
              <Command.Group
                heading={
                  <span className="tracking-[0.08em] opacity-50 text-[#A3A39E] font-mono font-medium text-[10px] leading-3 px-3 pt-2.5 pb-1.5 block">
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
                  className="flex items-center justify-between rounded-lg py-2.5 px-3 cursor-pointer data-[selected=true]:bg-[#F6F5F1]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-35">
                      <circle cx="7" cy="7" r="6" stroke="#2E2E2C" strokeWidth="1.2" />
                      <path d="M7 4.5V9.5M4.5 7H9.5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#2E2E2C] font-medium text-[13px] leading-4">
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
                  className="flex items-center justify-between rounded-lg py-2.5 px-3 cursor-pointer data-[selected=true]:bg-[#F6F5F1]"
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-35">
                      <circle cx="7" cy="7" r="2" stroke="#2E2E2C" strokeWidth="1.2" />
                      <path d="M7 1V3M7 11V13M1 7H3M11 7H13M2.75 2.75L4.17 4.17M9.83 9.83L11.25 11.25M11.25 2.75L9.83 4.17M4.17 9.83L2.75 11.25" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#2E2E2C] font-medium text-[13px] leading-4">
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
                    className="flex items-center justify-between rounded-lg py-2.5 px-3 cursor-pointer data-[selected=true]:bg-[#F6F5F1]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="rounded-full size-2 shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-[#2E2E2C] font-medium text-[13px] leading-4">
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
            <Command.Empty className="py-6 text-center text-[13px] text-[#A3A39E]">
              No results found.
            </Command.Empty>
          )}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center gap-3 py-2.5 px-5 border-t border-[#2E2E2C0F]">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] py-px px-1 bg-[#F6F5F1] border border-[#2E2E2C0F]">
              <span className="text-[#A3A39E] font-mono font-medium text-[9px] leading-[14px]">↑↓</span>
            </span>
            <span className="opacity-50 text-[#A3A39E] font-mono text-[10px] leading-3">Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] py-px px-1 bg-[#F6F5F1] border border-[#2E2E2C0F]">
              <span className="text-[#A3A39E] font-mono font-medium text-[9px] leading-[14px]">↵</span>
            </span>
            <span className="opacity-50 text-[#A3A39E] font-mono text-[10px] leading-3">Open</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center rounded-[3px] py-px px-1 bg-[#F6F5F1] border border-[#2E2E2C0F]">
              <span className="text-[#A3A39E] font-mono font-medium text-[9px] leading-[14px]">esc</span>
            </span>
            <span className="opacity-50 text-[#A3A39E] font-mono text-[10px] leading-3">Close</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

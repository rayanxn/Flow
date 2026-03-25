"use client";

import type { RefObject } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { cn } from "@/lib/utils/cn";
import type { ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
import type { FilterCategory } from "@/lib/hooks/use-issue-filters";

interface FilterBarProps {
  filters: ViewFilters;
  searchQuery: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  onSearchChange: (q: string) => void;
  onToggleFilter: (key: keyof ViewFilters, value: string) => void;
  onClearFilter: (key: keyof ViewFilters) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  enabledFilters?: FilterCategory[];
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
  labels?: { id: string; name: string; color: string }[];
  projects?: { id: string; name: string; color: string }[];
}

export function FilterBar({
  filters,
  searchQuery,
  searchInputRef,
  onSearchChange,
  onToggleFilter,
  onClearFilter,
  onClearAll,
  hasActiveFilters,
  enabledFilters = ["status", "priority", "assignee", "label"],
  members = [],
  labels = [],
  projects = [],
}: FilterBarProps) {
  const statusCount = filters.status?.length ?? 0;
  const priorityCount = filters.priority?.length ?? 0;
  const assigneeCount = filters.assignee_ids?.length ?? 0;
  const labelCount = filters.label_ids?.length ?? 0;
  const projectCount = filters.project_ids?.length ?? 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter issues…"
            className="h-8 w-[200px] rounded-lg border border-border bg-surface pl-8 pr-8 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {!searchQuery && (
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-text-muted/60 bg-surface-hover border border-border rounded px-1 py-0.5 font-mono leading-none">
              F
            </kbd>
          )}
        </div>

        {/* Status filter */}
        {enabledFilters.includes("status") && (
          <FilterDropdownTrigger
            label="Status"
            count={statusCount}
          >
            {STATUS_ORDER.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={filters.status?.includes(s) ?? false}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggleFilter("status", s)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: STATUS_CONFIG[s].color }}
                />
                {STATUS_CONFIG[s].label}
              </DropdownMenuCheckboxItem>
            ))}
          </FilterDropdownTrigger>
        )}

        {/* Priority filter */}
        {enabledFilters.includes("priority") && (
          <FilterDropdownTrigger
            label="Priority"
            count={priorityCount}
          >
            {([0, 1, 2, 3] as IssuePriority[]).map((p) => (
              <DropdownMenuCheckboxItem
                key={p}
                checked={filters.priority?.includes(p) ?? false}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggleFilter("priority", String(p))}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: PRIORITY_CONFIG[p].color }}
                />
                {PRIORITY_CONFIG[p].label}
              </DropdownMenuCheckboxItem>
            ))}
          </FilterDropdownTrigger>
        )}

        {/* Assignee filter */}
        {enabledFilters.includes("assignee") && members.length > 0 && (
          <FilterDropdownTrigger
            label="Assignee"
            count={assigneeCount}
          >
            {members.map((m) => (
              <DropdownMenuCheckboxItem
                key={m.user_id}
                checked={filters.assignee_ids?.includes(m.user_id) ?? false}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggleFilter("assignee_ids", m.user_id)}
              >
                {m.profile.full_name ?? m.profile.email}
              </DropdownMenuCheckboxItem>
            ))}
          </FilterDropdownTrigger>
        )}

        {/* Label filter */}
        {enabledFilters.includes("label") && labels.length > 0 && (
          <FilterDropdownTrigger
            label="Label"
            count={labelCount}
          >
            {labels.map((l) => (
              <DropdownMenuCheckboxItem
                key={l.id}
                checked={filters.label_ids?.includes(l.id) ?? false}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggleFilter("label_ids", l.id)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: l.color }}
                />
                {l.name}
              </DropdownMenuCheckboxItem>
            ))}
          </FilterDropdownTrigger>
        )}

        {/* Project filter (My Issues only) */}
        {enabledFilters.includes("project") && projects.length > 0 && (
          <FilterDropdownTrigger
            label="Project"
            count={projectCount}
          >
            {projects.map((p) => (
              <DropdownMenuCheckboxItem
                key={p.id}
                checked={filters.project_ids?.includes(p.id) ?? false}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onToggleFilter("project_ids", p.id)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
              </DropdownMenuCheckboxItem>
            ))}
          </FilterDropdownTrigger>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status chips */}
          {filters.status?.map((s) => (
            <FilterChip
              key={`status-${s}`}
              color={STATUS_CONFIG[s].color}
              label={STATUS_CONFIG[s].label}
              onRemove={() => onToggleFilter("status", s)}
            />
          ))}

          {/* Priority chips */}
          {filters.priority?.map((p) => (
            <FilterChip
              key={`priority-${p}`}
              color={PRIORITY_CONFIG[p].color}
              label={PRIORITY_CONFIG[p].label}
              onRemove={() => onToggleFilter("priority", String(p))}
            />
          ))}

          {/* Assignee chips */}
          {filters.assignee_ids?.map((id) => {
            const m = members.find((m) => m.user_id === id);
            return (
              <FilterChip
                key={`assignee-${id}`}
                label={m?.profile.full_name ?? m?.profile.email ?? "Unknown"}
                onRemove={() => onToggleFilter("assignee_ids", id)}
              />
            );
          })}

          {/* Label chips */}
          {filters.label_ids?.map((id) => {
            const l = labels.find((l) => l.id === id);
            return (
              <FilterChip
                key={`label-${id}`}
                color={l?.color}
                label={l?.name ?? "Unknown"}
                onRemove={() => onToggleFilter("label_ids", id)}
              />
            );
          })}

          {/* Project chips */}
          {filters.project_ids?.map((id) => {
            const p = projects.find((p) => p.id === id);
            return (
              <FilterChip
                key={`project-${id}`}
                color={p?.color}
                label={p?.name ?? "Unknown"}
                onRemove={() => onToggleFilter("project_ids", id)}
              />
            );
          })}

          {/* Search chip */}
          {searchQuery && (
            <FilterChip
              label={`"${searchQuery}"`}
              onRemove={() => onSearchChange("")}
            />
          )}

          <button
            onClick={onClearAll}
            className="text-[11px] text-text-muted hover:text-text transition-colors px-1.5 py-0.5"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterDropdownTrigger({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 h-8 px-2.5 text-xs rounded-lg border transition-colors",
            count > 0
              ? "border-text/20 text-text bg-surface-hover"
              : "border-border text-text-secondary hover:bg-surface-hover",
          )}
        >
          <span>{label}</span>
          {count > 0 && (
            <span className="bg-text/10 text-text text-[10px] rounded-full px-1.5 py-0.5 leading-none font-medium">
              {count}
            </span>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] max-h-[280px] overflow-y-auto">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterChip({
  label,
  color,
  onRemove,
}: {
  label: string;
  color?: string;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-surface-hover border border-border hover:bg-muted transition-colors group"
    >
      {color && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
      <X className="w-2.5 h-2.5 text-text-muted group-hover:text-text transition-colors" />
    </button>
  );
}

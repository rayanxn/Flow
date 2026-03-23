"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/providers/workspace-provider";
import { createProject } from "@/lib/actions/workspaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";

const PROJECT_COLORS = [
  "#DC2626",
  "#2563EB",
  "#0D9488",
  "#16A34A",
  "#78716C",
  "#292524",
];

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams?: { id: string; name: string }[];
}

export function CreateProjectModal({
  open,
  onOpenChange,
  teams = [],
}: CreateProjectModalProps) {
  const router = useRouter();
  const { workspace } = useWorkspace();
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("workspaceId", workspace.id);
    formData.set("color", color);
    formData.set("isPrivate", String(isPrivate));

    const result = await createProject(formData);

    if ("error" in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Project Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Mobile App"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="What is this project about?"
                rows={3}
                className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors resize-none"
              />
            </div>

            {/* Color & Team row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  {PROJECT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-5 h-5 rounded-full transition-all",
                        color === c
                          ? "ring-2 ring-offset-2 ring-offset-surface ring-primary"
                          : "hover:scale-110",
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="teamId">Team</Label>
                <select
                  id="teamId"
                  name="teamId"
                  className="flex h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                  defaultValue=""
                >
                  <option value="">No team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Private toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">Private project</p>
                <p className="text-xs text-text-muted">
                  Only visible to team members
                </p>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

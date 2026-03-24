"use client";

import { useState, useActionState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createWorkspace,
  createProject,
  createWorkspaceInvite,
  finishOnboarding,
} from "@/lib/actions/workspaces";
import type { ActionResponse, Tables } from "@/lib/types";
import { PROJECT_COLORS } from "@/lib/constants/colors";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TEAM_SIZES = ["1 – 5", "6 – 20", "20+"] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={cn(
            "h-1 w-8 rounded-full transition-colors",
            s <= step ? "bg-primary" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------

function TopBar({ step }: { step: number }) {
  return (
    <header className="flex items-center justify-between px-8 py-5">
      <span className="font-serif text-xl text-text">Flowboard</span>
      <ProgressBar step={step} />
      <span className="uppercase tracking-wider text-xs font-medium text-text-secondary">
        Step {step} of 3
      </span>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Step 1 – Workspace
// ---------------------------------------------------------------------------

type WorkspaceState = ActionResponse<Tables<"workspaces">> | null;

function StepWorkspace({
  onCreated,
}: {
  onCreated: (workspace: Tables<"workspaces">) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [teamSize, setTeamSize] = useState<string>("1 – 5");

  // Keep slug in sync with name unless user manually edits
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  async function action(
    _prev: WorkspaceState,
    formData: FormData,
  ): Promise<WorkspaceState> {
    formData.set("teamSize", teamSize);
    const result = await createWorkspace(formData);
    if (result.data) {
      onCreated(result.data);
    }
    return result;
  }

  const [state, formAction, pending] = useActionState<WorkspaceState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Acme Inc"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Workspace URL</Label>
        <div className="flex h-12 w-full rounded-lg border border-border bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-border-strong transition-colors">
          <span className="flex items-center pl-3 pr-1 text-sm text-text-muted select-none whitespace-nowrap">
            flowboard.app/
          </span>
          <input
            id="slug"
            name="slug"
            className="flex-1 bg-transparent py-2 pr-3 text-sm text-text outline-none placeholder:text-text-muted"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Team Size</Label>
        <div className="grid grid-cols-3 gap-3">
          {TEAM_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setTeamSize(size)}
              className={cn(
                "h-12 rounded-lg border text-sm font-medium transition-colors",
                teamSize === size
                  ? "border-accent bg-accent-light text-text"
                  : "border-border bg-surface text-text hover:bg-surface-hover",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating..." : "Continue"}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2 – Invite
// ---------------------------------------------------------------------------

function StepInvite({
  workspace,
  onContinue,
}: {
  workspace: Tables<"workspaces">;
  onContinue: () => void;
}) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      const result = await createWorkspaceInvite(workspace.id, "member");
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setInviteUrl(`${origin}/invite/${result.data.id}`);
      }
      setLoading(false);
    }
    generate();
  }, [workspace.id]);

  async function copyToClipboard() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the input
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-col gap-2">
        <Label>Invite Link</Label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={loading ? "Generating link..." : inviteUrl ?? ""}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={copyToClipboard}
            disabled={loading || !inviteUrl}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <Button type="button" size="lg" className="w-full" onClick={onContinue}>
        Continue
      </Button>

      <button
        type="button"
        onClick={onContinue}
        className="text-sm text-text-muted hover:text-text-secondary transition-colors text-center"
      >
        Skip for now
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 – First project
// ---------------------------------------------------------------------------

type ProjectState = ActionResponse<Tables<"projects">> | null;

function StepProject({
  workspace,
}: {
  workspace: Tables<"workspaces">;
}) {
  const [color, setColor] = useState<string>(PROJECT_COLORS[0]);

  async function action(
    _prev: ProjectState,
    formData: FormData,
  ): Promise<ProjectState> {
    formData.set("workspaceId", workspace.id);
    formData.set("color", color);
    const result = await createProject(formData);
    if (result.data) {
      await finishOnboarding(workspace.slug);
    }
    return result;
  }

  const [state, formAction, pending] = useActionState<ProjectState, FormData>(
    action,
    null,
  );

  async function skip() {
    await finishOnboarding(workspace.slug);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          name="name"
          placeholder="My First Project"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="projectDescription">Description</Label>
        <textarea
          id="projectDescription"
          name="description"
          rows={3}
          placeholder="What is this project about?"
          className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text ring-offset-background placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-border-strong transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <div className="flex items-center gap-3">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                color === c
                  ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                  : "hover:scale-110",
              )}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating..." : "Continue"}
      </Button>

      <button
        type="button"
        onClick={skip}
        className="text-sm text-text-muted hover:text-text-secondary transition-colors text-center"
      >
        Skip for now
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step content map
// ---------------------------------------------------------------------------

const STEP_META: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Set up your workspace",
    subtitle: "This is where your team will plan, track, and ship.",
  },
  2: {
    title: "Invite your team",
    subtitle: "Share this link with your teammates.",
  },
  3: {
    title: "Create your first project",
    subtitle: "Projects organize your team\u2019s work.",
  },
};

// ---------------------------------------------------------------------------
// Root wizard component
// ---------------------------------------------------------------------------

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState<Tables<"workspaces"> | null>(null);

  const meta = STEP_META[step];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar step={step} />

      <main className="flex flex-1 items-start justify-center pt-24 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-text">{meta.title}</h1>
            <p className="mt-2 text-sm text-text-secondary">{meta.subtitle}</p>
          </div>

          {step === 1 && (
            <StepWorkspace
              onCreated={(ws) => {
                setWorkspace(ws);
                setStep(2);
              }}
            />
          )}

          {step === 2 && workspace && (
            <StepInvite
              workspace={workspace}
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && workspace && (
            <StepProject workspace={workspace} />
          )}
        </div>
      </main>
    </div>
  );
}

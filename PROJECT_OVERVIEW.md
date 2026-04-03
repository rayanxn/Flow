# Flow Project Overview

## What This Project Is

Flow is a multi-tenant project management and issue tracking app. The product is positioned as a calmer, lower-ceremony alternative to heavier PM tools: teams capture work, organize it into projects and sprints, track progress visually, and stay aligned through activity and notifications.

Public users see a marketing landing page at `/`. Signed-in users are pushed into onboarding or into a workspace-scoped app at `/{workspaceSlug}/...`.

## Core Product Shape

- Work happens inside a workspace.
- A workspace contains members, teams, projects, sprints, issues, labels, saved views, comments, activities, and notifications.
- Main app areas are:
  - dashboard
  - inbox
  - my issues
  - projects
  - views
  - teams
  - analytics
  - settings
- Project pages support multiple planning surfaces, especially board and list views, plus sprint planning, timeline, and project settings.
- Issues are a first-class object with assignee, priority, status, due date, story points, labels, checklist items, rich-text description, comment thread, and permalinkable detail panel state.
- The UI is intentionally polished and product-led, not just admin CRUD.

## Architecture

- Framework: Next.js 16 App Router with React 19.
- Styling/UI: Tailwind CSS v4, Radix primitives, custom component library in `src/components/ui`.
- Backend: Supabase for auth, database, and realtime.
- Auth/session handling lives in `src/middleware.ts` and `src/lib/supabase/*`.
- Most reads are done through server-side query helpers in `src/lib/queries/*`.
- Most writes happen through server actions in `src/lib/actions/*`.
- The workspace shell is assembled in `src/app/(app)/[workspaceSlug]/layout.tsx`.
- Realtime hooks exist for issues, comments, and notification counts.

## Important User Flows

1. Authenticated users without a workspace go through a 3-step onboarding flow:
   create workspace -> invite teammates -> create first project.
2. Authenticated users with a workspace are redirected to `/{workspaceSlug}/dashboard`.
3. Daily use is centered on project board/list views, issue detail editing, sprint context, inbox notifications, saved views, and analytics.

## Where To Read First

- `src/app/page.tsx`: landing page vs authenticated redirect.
- `src/app/(app)/[workspaceSlug]/layout.tsx`: workspace bootstrapping and shell.
- `src/lib/queries/*`: how server data is fetched.
- `src/lib/actions/*`: how mutations are performed.
- `tests/phase1-auth-flow.spec.ts`: best single file for understanding the core auth/onboarding/dashboard flow.

## Testing Notes

- Playwright is the main E2E harness.
- `tests/auth.setup.ts` creates/saves auth state for the seeded workspace flow.
- `tests/phase1-auth-flow.spec.ts` creates a fresh user and unique workspace, so it is useful when you want an end-to-end auth/onboarding check without relying on existing seeded state.
- Seeded authenticated workspace slug for app tests: `pw-workspace`.

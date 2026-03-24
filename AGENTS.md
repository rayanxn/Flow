<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Playwright E2E Testing

Auth is pre-configured via `storageState`. Never write login code in tests.

- `tests/auth.setup.ts` logs in and saves cookies to `tests/.auth/user.json`
- `playwright.config.ts` has 3 projects: `setup` (runs first), `no-auth`, and `authenticated` (inherits session)
- Any `.spec.ts` file in `tests/` automatically gets the authenticated session
- Test workspace slug: **`pw-workspace`** — use this in all test URLs
- Run tests: `npx playwright test tests/my-test.spec.ts --project=authenticated`

# Playwright CLI (`/playwright-cli`) — Browser Automation

The `/playwright-cli` skill is pre-configured for authenticated browsing on localhost.

## How auth works

- `.playwright/cli.config.json` auto-loads `storageState` from `tests/.auth/user.json`
- Auth tokens refresh automatically via Supabase middleware (~1 week lifetime)
- No manual `state-load` step is needed — just `open` and go

## App details

- **Base URL**: `http://localhost:3000`
- **Workspace slug**: `pw-workspace` — all authenticated pages live under `/pw-workspace/...`
- **Dashboard**: `http://localhost:3000/pw-workspace/dashboard`
- **Available pages**: dashboard, inbox, my-issues, projects, views, teams, analytics, settings

## Concurrent agents

Always use a named session (`-s=`) to avoid colliding with other agents on the default session:
```bash
playwright-cli -s=myagent open http://localhost:3000/pw-workspace/dashboard
playwright-cli -s=myagent click e5
playwright-cli -s=myagent close
```
Pick a descriptive name (e.g. `-s=dashboard-test`, `-s=projects-audit`). All subsequent commands must use the same `-s=` flag.

## Test data

The workspace is seeded with realistic data (4 projects, 20 issues, 3 teams, 9 members, activities, notifications). To re-seed:
```bash
npx tsx scripts/seed-test-data.ts          # seed (skips if already seeded)
npx tsx scripts/seed-test-data.ts --force   # clear + re-seed
```

## If auth is stale (redirected to /login)

Run this **before** invoking the skill to refresh the auth state:
```bash
npx playwright test tests/auth.setup.ts --project=setup
```

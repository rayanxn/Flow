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

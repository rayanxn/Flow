# Flow

> A lightweight issue tracker for teams who'd rather build than manage tickets.

![Flow landing page](docs/images/hero.png)

## About

Flow is a project management app for small product teams. Projects, sprints, issues, and analytics, all in one app.
## A tour

### Dashboard

Active sprint at the top, your assigned issues, and an activity feed showing what the rest of the team has been up to. First thing you see after signing in.

![Dashboard](docs/images/dashboard.png)

### Board

Kanban with filters for status, priority, assignee, and label. Drag-and-drop is built on dnd-kit with optimistic updates, so moving a card doesn't wait on the network.

![Board view](docs/images/board.png)

### Analytics

Throughput, cycle time, cycle-time distribution, per-assignee delivery. Aggregations run on the server; charts are Recharts.

![Analytics](docs/images/analytics.png)

### Inbox

Notifications for activity on issues you care about. Filter by assigned or all, mark everything read in one click.

![Inbox](docs/images/inbox.png)

## Built with

- Frontend: Next.js 16, React 19, TypeScript, Tailwind v4, GSAP + Lenis for motion
- Backend: Supabase (Postgres, Auth, Row-Level Security), Server Actions, Realtime channels
- Editor & UX: TipTap, Radix, dnd-kit, cmdk, Recharts

## Run it locally

```bash
git clone https://github.com/rayanxn/Flow.git
cd Flow
npm install
cp .env.local.example .env.local   # fill in your Supabase keys
npm run dev
```

Open [localhost:3000](http://localhost:3000).

To seed a realistic workspace (4 projects, 20 issues, 3 teams, notifications):

```bash
npx tsx scripts/seed-test-data.ts
```

---

Built as a Senior Project

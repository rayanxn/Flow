const GROUPS = [
  {
    title: "Frontend",
    blurb: "React 19 on Next.js 16's App Router, with motion as a first-class citizen.",
    items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "GSAP + Lenis"],
  },
  {
    title: "Backend",
    blurb: "Postgres with row-level security. Real-time subscriptions where it counts.",
    items: ["Supabase Auth", "Postgres + RLS", "Server Actions", "Realtime channels"],
  },
  {
    title: "Editor & UX",
    blurb: "The interaction layer users actually feel — drag, type, search, ship.",
    items: ["TipTap editor", "Radix primitives", "dnd-kit", "cmdk palette", "Recharts"],
  },
];

export function Stack() {
  return (
    <section id="stack" className="px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-wider text-text-muted uppercase">Stack</p>
        <h2 className="mt-4 max-w-xl font-serif text-4xl italic text-text sm:text-5xl">
          Built on a modern web stack.
        </h2>
        <p className="mt-4 max-w-lg text-base text-text-secondary">
          Type-safe end to end. Real-time where it matters. Every piece chosen on purpose.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {GROUPS.map((group) => (
            <div
              key={group.title}
              className="flex flex-col rounded-2xl border border-border bg-surface p-8"
            >
              <h3 className="text-xl font-semibold text-text">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{group.blurb}</p>
              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-mono text-sm text-text-secondary"
                  >
                    <span className="h-1 w-1 rounded-full bg-text-muted" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

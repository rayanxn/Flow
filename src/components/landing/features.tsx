import { FeatureTriage } from "./feature-triage";
import { FeatureActivity } from "./feature-activity";
import { FeatureSprint } from "./feature-sprint";

const CARDS = [
  {
    component: FeatureTriage,
    title: "Smart Triage",
    description: "Issues surface by priority. Critical work rises to the top automatically.",
  },
  {
    component: FeatureActivity,
    title: "Activity Stream",
    description: "See every move in real-time. No more checking in — just tune in.",
  },
  {
    component: FeatureSprint,
    title: "Sprint Planner",
    description: "Plan your week visually. Drag, drop, ship.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <p className="font-mono text-xs tracking-wider text-text-muted uppercase">Features</p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl italic text-text sm:text-5xl">
          Built for how teams actually work
        </h2>
        <p className="mt-4 max-w-lg text-base text-text-secondary">
          Every feature designed to reduce noise and amplify progress.
        </p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="h-64">
                <card.component />
              </div>
              <div className="border-t border-border px-6 py-6">
                <h3 className="text-base font-semibold text-text">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

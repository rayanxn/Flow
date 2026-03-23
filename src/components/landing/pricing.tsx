import { MagneticButton } from "./magnetic-button";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    sub: "For individuals and small side projects.",
    features: [
      "Up to 3 projects",
      "Unlimited tasks",
      "Board and list views",
      "Basic integrations",
      "Community support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    dark: false,
  },
  {
    name: "Scale",
    price: "$12",
    priceSuffix: "/mo per user",
    sub: "For growing teams that ship fast.",
    badge: "Popular",
    features: [
      "Unlimited projects",
      "Sprint planning tools",
      "Advanced workflows",
      "GitHub and Slack integrations",
      "Priority support",
      "Custom fields",
      "Team analytics",
    ],
    cta: "Start Free Trial",
    variant: "inverted" as const,
    dark: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "For orgs that need control and compliance.",
    features: [
      "Everything in Scale",
      "SSO and SAML",
      "Audit logs",
      "Custom roles and permissions",
      "Dedicated support",
      "99.9% SLA",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    dark: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-mono text-xs tracking-wider text-text-muted uppercase">Pricing</p>
        <h2 className="mt-4 font-serif text-4xl italic text-text sm:text-5xl">
          Start free. Scale when ready.
        </h2>
        <p className="mt-4 text-base text-text-secondary">
          No surprises. No per-seat gotchas. Just honest pricing.
        </p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl p-8 text-left ${
                plan.dark
                  ? "bg-primary text-white"
                  : "border border-border bg-surface"
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${plan.dark ? "text-white" : "text-text"}`}>
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.dark ? "text-white" : "text-text"}`}>
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className={`text-sm ${plan.dark ? "text-white/60" : "text-text-muted"}`}>
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${plan.dark ? "text-white/50" : "text-text-muted"}`}>
                  {plan.sub}
                </p>
              </div>

              {/* Divider */}
              <div className={`my-6 h-px ${plan.dark ? "bg-white/10" : "bg-border"}`} />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-sm ${plan.dark ? "text-white/70" : "text-text-secondary"}`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <MagneticButton
                  variant={plan.variant}
                  href="/signup"
                  className={`w-full ${plan.dark ? "border-white/20" : ""}`}
                >
                  {plan.cta}
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

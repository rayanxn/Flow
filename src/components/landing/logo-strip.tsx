const BRANDS = ["Vercel", "Stripe", "Linear", "Notion", "Loom"];

export function LogoStrip() {
  return (
    <section className="px-6 pb-24 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs text-text-muted">Trusted by 2,400+ teams worldwide</p>
        <div className="mt-3 flex items-center gap-6">
          {BRANDS.map((brand, i) => (
            <span key={brand} className="font-mono text-sm text-text-muted/50">
              {brand}
              {i < BRANDS.length - 1 && <span className="ml-6">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

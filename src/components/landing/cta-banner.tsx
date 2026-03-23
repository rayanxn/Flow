import { MagneticButton } from "./magnetic-button";

export function CtaBanner() {
  return (
    <section className="px-6 pb-8 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-primary px-8 py-12 sm:flex-row sm:px-12">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Ready to move work forward?
            </h3>
            <p className="mt-2 text-sm text-white/50">
              14-day free trial on all paid plans. No credit card required.
            </p>
          </div>
          <MagneticButton variant="inverted" href="/signup" size="lg">
            Start Free
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

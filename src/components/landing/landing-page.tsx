import { NoiseOverlay } from "./noise-overlay";
import { SmoothScroll } from "./smooth-scroll";
import { Navbar } from "./navbar";
import { Hero } from "./hero";

import { Features } from "./features";
import { Workflow } from "./workflow";
import { Stack } from "./stack";
import { CtaBanner } from "./cta-banner";
import { Footer } from "./footer";
import { ScrollReveal } from "./scroll-reveal";

export function LandingPage() {
  return (
    <div className="landing-light relative min-h-screen bg-background">
      <SmoothScroll />
      <NoiseOverlay />
      <Navbar />
      <Hero />
      <ScrollReveal>
        <div className="pb-16">
          <Features />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <Workflow />
      </ScrollReveal>
      <ScrollReveal>
        <Stack />
      </ScrollReveal>
      <ScrollReveal>
        <div className="pb-12">
          <CtaBanner />
        </div>
      </ScrollReveal>
      <Footer />
    </div>
  );
}

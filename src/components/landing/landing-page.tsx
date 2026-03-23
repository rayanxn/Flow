import { NoiseOverlay } from "./noise-overlay";
import { SmoothScroll } from "./smooth-scroll";
import { Navbar } from "./navbar";
import { Hero } from "./hero";

import { Features } from "./features";
import { Manifesto } from "./manifesto";
import { Workflow } from "./workflow";
import { Pricing } from "./pricing";
import { CtaBanner } from "./cta-banner";
import { Footer } from "./footer";
import { ScrollReveal } from "./scroll-reveal";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <SmoothScroll />
      <NoiseOverlay />
      <Navbar />
      <Hero />
      <ScrollReveal>
        <div className="pb-16">
          <Features />
        </div>
      </ScrollReveal>
      <Manifesto />
      <ScrollReveal>
        <Workflow />
      </ScrollReveal>
      <ScrollReveal>
        <Pricing />
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

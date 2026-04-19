"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./magnetic-button";
import { HeroMockup } from "./hero-mockup";
import { useGsap } from "@/lib/hooks/use-gsap";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });

      tl.fromTo("[data-hero='line1']", { y: 50, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo("[data-hero='line2']", { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.7")
        .fromTo("[data-hero='subtitle']", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.5")
        .fromTo("[data-hero='cta']", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4")
        .fromTo("[data-hero='mockup']", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.5");
    },
    containerRef,
    [],
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center px-6 pt-24 pb-16 sm:px-12"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <div>
          <h1>
            <span
              data-hero="line1"
              className="block text-5xl font-bold tracking-tight text-text opacity-0 sm:text-6xl lg:text-8xl"
            >
              Track work.
            </span>
            <span
              data-hero="line2"
              className="block font-serif text-5xl italic text-text opacity-0 sm:text-6xl lg:text-8xl"
            >
              Ship it.
            </span>
          </h1>

          <p
            data-hero="subtitle"
            className="mt-8 max-w-md font-mono text-sm leading-relaxed text-text-secondary opacity-0 sm:text-base"
          >
            A lightweight issue tracker for teams who&apos;d rather build than manage tickets.
          </p>

          <div data-hero="cta" className="mt-10 flex items-center gap-6 opacity-0">
            <MagneticButton href="/signup" size="lg">
              Start Free
            </MagneticButton>

            <a
              href="#features"
              className="group flex items-center gap-1.5 font-mono text-sm text-text-secondary transition-colors duration-200 hover:text-text"
            >
              See how it works
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Mockup */}
        <div data-hero="mockup" className="opacity-0" style={{ perspective: "1200px" }}>
          <div style={{ transform: "rotateX(2deg) rotateY(-1deg)" }}>
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINE1 = "Work should not disappear into status meetings.";
const LINE2 = "It should move in plain sight.";

function SplitWords({
  text,
  className,
  dataAttr,
}: {
  text: string;
  className: string;
  dataAttr: string;
}) {
  return (
    <p className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} data-word={dataAttr} className="inline-block opacity-[0.12]">
          {word}
          {i < text.split(" ").length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </p>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      // Line 1 — reveal each word to muted white
      const line1Words = gsap.utils.toArray<HTMLElement>("[data-word='line1']");
      line1Words.forEach((word, i) => {
        tl.to(word, { opacity: 0.4, duration: 0.1, ease: "none" }, i * 0.05);
      });

      // Line 2 — reveal each word to full white
      const line2Words = gsap.utils.toArray<HTMLElement>("[data-word='line2']");
      const line2Start = line1Words.length * 0.05 + 0.1;
      line2Words.forEach((word, i) => {
        tl.to(word, { opacity: 1, duration: 0.1, ease: "none" }, line2Start + i * 0.06);
      });

      // Label
      const labelStart = line2Start + line2Words.length * 0.06 + 0.1;
      tl.to("[data-manifesto='label']", { opacity: 1, duration: 0.15, ease: "none" }, labelStart);
    },
    ref,
    [],
  );

  return (
    <section
      ref={ref}
      className="relative z-10 -mt-12 flex min-h-[70vh] flex-col items-center justify-center rounded-t-[3rem] bg-[#1A1A1A] px-6 py-36 text-center"
    >
      <div className="max-w-3xl">
        <SplitWords
          text={LINE1}
          dataAttr="line1"
          className="font-serif text-2xl italic leading-snug text-white/40 sm:text-3xl lg:text-4xl"
        />
        <SplitWords
          text={LINE2}
          dataAttr="line2"
          className="mt-5 text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl"
        />

        <div data-manifesto="label" className="mt-12 opacity-0">
          <div className="mx-auto h-px w-12 bg-white/20" />
          <p className="mt-4 font-mono text-[11px] tracking-[0.25em] text-white/30 uppercase">
            The Flowboard Manifesto
          </p>
        </div>
      </div>
    </section>
  );
}

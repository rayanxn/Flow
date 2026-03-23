"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  y?: number;
  delay?: number;
}

export function ScrollReveal({ children, y = 40, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    ref,
    [],
  );

  return (
    <div ref={ref} className="opacity-0">
      {children}
    </div>
  );
}

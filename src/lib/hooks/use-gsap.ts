"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsap(
  callback: () => void,
  containerRef: RefObject<HTMLElement | null>,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(callback, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

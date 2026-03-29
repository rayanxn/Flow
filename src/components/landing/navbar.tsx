"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ease-out",
          scrolled
            ? "border border-border/50 bg-surface/50 shadow-sm backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <a href="/" className="font-serif text-xl text-text">
          Flow
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </a>
          ))}

          <a
            href="/signup"
            className="group flex items-center gap-1.5 text-sm font-medium text-text transition-colors duration-200 hover:text-accent"
          >
            Start Free
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}

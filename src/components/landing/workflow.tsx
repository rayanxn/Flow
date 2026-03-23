"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Capture",
    description: "Drop tasks, bugs, and ideas into one inbox. Nothing gets lost.",
  },
  {
    number: "02",
    title: "Organize",
    description: "Drag into lanes. See status at a glance. Move work forward.",
  },
  {
    number: "03",
    title: "Ship",
    description: "Track progress in real-time. Ship with confidence, not anxiety.",
  },
];

function IssueListMockup() {
  const items = [
    { label: "Redesign onboarding flow", color: "bg-success" },
    { label: "Fix sidebar collapse bug", color: "bg-accent" },
    { label: "Write API docs for v2", color: "bg-success" },
  ];

  return (
    <div className="space-y-2 p-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
        >
          <div className={`h-6 w-1 rounded-full ${item.color}`} />
          <span className="text-sm text-text">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function KanbanMockup() {
  const cols = [
    { title: "TODO", count: 2 },
    { title: "IN PROGRESS", count: 2 },
    { title: "DONE", count: 3 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-5">
      {cols.map((col) => (
        <div key={col.title}>
          <div className="mb-2 text-[10px] font-medium tracking-wider text-text-muted uppercase">
            {col.title}
          </div>
          <div className="space-y-2">
            {Array.from({ length: col.count }).map((_, i) => (
              <div key={i} className="h-8 rounded-lg bg-border/50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressMockup() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Sprint Progress</span>
        <span className="font-mono text-sm text-text-secondary">78%</span>
      </div>
      <div className="mt-8">
        <svg viewBox="0 0 280 80" className="w-full" fill="none">
          <line
            x1="0"
            y1="70"
            x2="280"
            y2="10"
            stroke="#D6CFC7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <polyline
            points="0,70 40,65 80,58 120,55 160,40 200,35 240,22 260,18"
            stroke="#C2410C"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="260" cy="18" r="4" fill="#C2410C" />
        </svg>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-[#1A1A1A]" />
            <span className="text-xs text-text-muted">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-0.5 w-4"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #D6CFC7, #D6CFC7 3px, transparent 3px, transparent 6px)",
              }}
            />
            <span className="text-xs text-text-muted">Ideal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCKUPS = [IssueListMockup, KanbanMockup, ProgressMockup];

export function Workflow() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-workflow-card]").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.1,
          },
        );
      });
    },
    ref,
    [],
  );

  return (
    <section id="workflow" ref={ref} className="px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-wider text-text-muted uppercase">Workflow</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">
          From idea to shipped{" "}
          <span className="font-serif italic font-normal">in three moves</span>
        </h2>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Mockup = MOCKUPS[i];
            return (
              <div key={step.number} data-workflow-card className="opacity-0">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <Mockup />
                </div>

                {/* Step info */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-text" />
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-serif text-4xl text-text/15">{step.number}</span>
                  <span className="text-xl font-semibold text-text">{step.title}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

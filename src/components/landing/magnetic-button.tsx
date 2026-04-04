"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "inverted";
  size?: "default" | "lg";
  className?: string;
  href?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  size = "default",
  className,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.15;
    const dy = (e.clientY - centerY) * 0.15;
    const maxPull = 6;
    setOffset({
      x: Math.max(-maxPull, Math.min(maxPull, dx)),
      y: Math.max(-maxPull, Math.min(maxPull, dy)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const baseStyles =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium active:scale-[0.98]";

  const sizeStyles = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantStyles = {
    primary: "bg-primary text-background",
    outline: "border border-border-strong text-text bg-transparent",
    inverted: "bg-surface text-primary",
  };

  const slideOverlay = {
    primary: "bg-primary-hover",
    outline: "bg-background",
    inverted: "bg-surface-hover",
  };

  const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 && offset.y === 0
      ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "transform 0.1s ease-out",
  };

  const inner = (
    <>
      <span
        className={cn(
          "absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0",
          slideOverlay[variant],
        )}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={classes}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </button>
  );
}

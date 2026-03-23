"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackClassName?: string;
  indicatorClassName?: string;
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      value,
      size = 48,
      strokeWidth = 4,
      className,
      trackClassName,
      indicatorClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedValue / 100) * circumference;

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("transform -rotate-90", className)}
        {...props}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={cn("text-border", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "text-primary transition-[stroke-dashoffset] duration-500 ease-in-out",
            indicatorClassName,
          )}
        />
        {children}
      </svg>
    );
  },
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };

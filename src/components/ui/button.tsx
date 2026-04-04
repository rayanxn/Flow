"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

const buttonVariants = {
  variant: {
    default: "bg-primary text-background hover:bg-primary-hover",
    secondary: "bg-surface border border-border text-text hover:bg-surface-hover",
    ghost: "bg-transparent text-text hover:bg-surface-hover",
    danger: "bg-danger text-white hover:bg-danger/90",
    outline: "bg-transparent border border-border text-text hover:bg-surface-hover",
  },
  size: {
    sm: "h-8 px-3 text-sm gap-1.5",
    default: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
    icon: "h-10 w-10 justify-center",
  },
} as const;

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

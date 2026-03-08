import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-4",
  default: "size-6",
  lg: "size-8",
} as const;

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "default",
  className,
}: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

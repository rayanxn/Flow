"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface SettingsNavItem {
  label: string;
  href: string;
}

interface SettingsNavProps {
  items: SettingsNavItem[];
  sectionLabel: string;
  basePath: string;
}

export function SettingsNav({ items, sectionLabel, basePath }: SettingsNavProps) {
  const pathname = usePathname();

  return (
    <nav className="w-50 shrink-0 border-r border-border-subtle py-6 px-5">
      <span className="text-[10px] font-mono font-medium text-text-muted opacity-40 tracking-[0.08em] uppercase">
        {sectionLabel}
      </span>
      <div className="mt-4 space-y-0.5">
        {items.map((item) => {
          const fullHref = `${basePath}${item.href}`;
          const isActive = pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "block py-2 px-3 rounded-lg text-[13px] font-mono transition-colors",
                isActive
                  ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                  : "text-text-muted opacity-40 hover:opacity-70",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

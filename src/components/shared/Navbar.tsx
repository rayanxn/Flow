"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutGrid, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  userEmail: string;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isBoardDetailPage = /^\/boards\/[^/]+$/.test(pathname ?? "");

  const handleSignOut = async () => {
    setErrorMessage("");
    setIsSigningOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage("Unable to sign out right now. Please try again.");
      setIsSigningOut(false);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-12 w-full items-center justify-between px-4 sm:px-5 lg:px-6">
        <div className="flex items-center gap-2">
          <Link href="/boards" className="text-base font-semibold tracking-tight">
            Task Orbit
          </Link>
          {!isBoardDetailPage ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden rounded-full text-muted-foreground md:inline-flex"
            >
              <Link href="/boards">
                <LayoutGrid className="size-4" />
                Boards
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-w-[260px] gap-2 rounded-full border-white/60 bg-background/75 shadow-xs backdrop-blur"
              >
                <span className="truncate">{userEmail}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">{userEmail}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  if (!isSigningOut) {
                    void handleSignOut();
                  }
                }}
                disabled={isSigningOut}
              >
                <LogOut className="size-4" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {errorMessage && (
        <p className="border-t px-4 py-2 text-center text-sm text-destructive">{errorMessage}</p>
      )}
    </header>
  );
}

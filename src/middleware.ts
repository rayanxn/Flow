import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password", "/callback"];
const AUTH_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLandingPage = pathname === "/";
  const isPublicRoute = isLandingPage || PUBLIC_PREFIXES.some((route) => pathname.startsWith(route));
  const isAuthPage = AUTH_PREFIXES.some((route) => pathname.startsWith(route));

  // Unauthenticated users can only access public routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated users on auth pages → redirect to onboarding or workspace
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { normalizeRedirectPath } from "@/lib/utils/redirect-path";

const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/callback",
  "/join",
];
const AUTH_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password"];

function getRequestedPath(request: NextRequest) {
  const search = request.nextUrl.search || "";
  return `${request.nextUrl.pathname}${search}`;
}

export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLandingPage = pathname === "/";
  const isPublicRoute = isLandingPage || PUBLIC_PREFIXES.some((route) => pathname.startsWith(route));
  const isAuthPage = AUTH_PREFIXES.some((route) => pathname.startsWith(route));

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", getRequestedPath(request));
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const nextPath = normalizeRedirectPath(request.nextUrl.searchParams.get("next"));
    const url = request.nextUrl.clone();
    url.pathname = nextPath ?? "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

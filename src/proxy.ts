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

function applyRedirectPath(url: URL, path: string) {
  const [pathname, search = ""] = path.split("?");
  url.pathname = pathname;
  url.search = search ? `?${search}` : "";
}

async function getDefaultSignedInPath(
  supabase: Awaited<ReturnType<typeof updateSession>>["supabase"],
  userId: string,
) {
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const workspace = membership?.workspace as { slug: string } | null | undefined;
  if (workspace?.slug) {
    return `/${workspace.slug}/dashboard`;
  }

  return "/onboarding";
}

export async function proxy(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);
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
    applyRedirectPath(url, nextPath ?? (await getDefaultSignedInPath(supabase, user.id)));
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

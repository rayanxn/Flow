export function normalizeRedirectPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export function buildAuthRedirectUrl(
  pathname: "/login" | "/signup",
  nextPath: string | null | undefined,
) {
  const safeNextPath = normalizeRedirectPath(nextPath);
  if (!safeNextPath) {
    return pathname;
  }

  return `${pathname}?next=${encodeURIComponent(safeNextPath)}`;
}

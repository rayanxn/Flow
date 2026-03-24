export function getInitials(
  name: string | null | undefined,
  fallbackEmail?: string,
): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (fallbackEmail) return fallbackEmail.slice(0, 2).toUpperCase();
  return "?";
}

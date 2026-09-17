export function getInitial(name: string | null | undefined): string {
  if (!name || !name.trim()) return "D";
  return name.trim().charAt(0).toUpperCase();
}

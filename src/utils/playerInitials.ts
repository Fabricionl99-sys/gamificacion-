/** Iniciales para avatar: nombre + apellido, solo nombre, o vacío si no hay datos. */
export function getPlayerInitials(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] ?? '';
    const b = parts[parts.length - 1][0] ?? '';
    return `${a}${b}`.toUpperCase();
  }
  return (parts[0][0] ?? '').toUpperCase();
}

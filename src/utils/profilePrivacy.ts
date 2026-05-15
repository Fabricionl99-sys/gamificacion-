const PUBLIC_KEY = 'wingoat_public_profile';

export function readPublicProfile(): boolean {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(PUBLIC_KEY) !== '0';
}

export function writePublicProfile(isPublic: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PUBLIC_KEY, isPublic ? '1' : '0');
}

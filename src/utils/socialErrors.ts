import axios from 'axios';

export type SocialErrorCode =
  | 'no_links_allowed'
  | 'profile_banned'
  | 'module_not_active'
  | 'banned_word'
  | 'unauthorized'
  | 'not_found'
  | 'generic';

export interface ParsedSocialError {
  code: SocialErrorCode;
  message: string;
  bannedWord?: string;
}

function detailFromError(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as { detail?: unknown }).detail;
    return typeof detail === 'string' ? detail : undefined;
  }
  return undefined;
}

export function parseSocialError(error: unknown): ParsedSocialError {
  if (!axios.isAxiosError(error)) {
    return { code: 'generic', message: 'Algo salió mal. Intentá de nuevo.' };
  }

  const status = error.response?.status;
  const detail = detailFromError(error.response?.data) ?? '';

  if (status === 401) {
    return { code: 'unauthorized', message: 'Tu sesión expiró. Recargá la página.' };
  }

  if (status === 404) {
    return { code: 'not_found', message: 'Contenido no disponible.' };
  }

  if (status === 403) {
    if (detail.includes('profile_banned') || detail.includes('banned')) {
      return {
        code: 'profile_banned',
        message: 'Tu perfil social está suspendido. Contactá soporte.',
      };
    }
    if (detail.includes('module') || detail.includes('not active')) {
      return {
        code: 'module_not_active',
        message: 'Social no está activo en este operador. Contactá al soporte.',
      };
    }
    return { code: 'generic', message: 'No tenés permiso para esta acción.' };
  }

  if (status === 400) {
    if (detail === 'no_links_allowed') {
      return { code: 'no_links_allowed', message: 'No se permiten enlaces en posts.' };
    }
    if (detail.startsWith('banned_word:')) {
      const word = detail.slice('banned_word:'.length).trim();
      return {
        code: 'banned_word',
        message: `Palabra no permitida: ${word}`,
        bannedWord: word,
      };
    }
    return { code: 'generic', message: detail || 'No se pudo completar la acción.' };
  }

  return { code: 'generic', message: detail || 'Algo salió mal. Intentá de nuevo.' };
}

export function toastMessageForSocialError(error: unknown, fallback: string): string {
  const parsed = parseSocialError(error);
  if (parsed.code === 'generic' && !parsed.message) return fallback;
  return parsed.message || fallback;
}

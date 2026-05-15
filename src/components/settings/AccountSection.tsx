import { useEffect, useState } from 'react';

import { usePlayerStore } from '../../store/playerStore';
import { readPublicProfile, writePublicProfile } from '../../utils/profilePrivacy';
import { Card } from '../ui/Card';

export type UiLocale = 'es' | 'en' | 'pt';
const LOCALE_KEY = 'wingoat_locale';

function readLocale(): UiLocale {
  if (typeof localStorage === 'undefined') return 'es';
  const v = localStorage.getItem(LOCALE_KEY);
  if (v === 'en' || v === 'pt') return v;
  return 'es';
}

interface AccountSectionProps {
  onOpenAvatarPicker: () => void;
}

export function AccountSection({ onOpenAvatarPicker }: AccountSectionProps) {
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const [publicProfile, setPublicProfile] = useState(readPublicProfile);
  const [locale, setLocale] = useState<UiLocale>(readLocale);

  useEffect(() => {
    writePublicProfile(publicProfile);
    updatePlayer({ isPrivate: !publicProfile });
  }, [publicProfile, updatePlayer]);

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale === 'es' ? 'es' : locale === 'pt' ? 'pt' : 'en';
  }, [locale]);

  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold text-text-primary">cuenta y perfil</h2>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md bg-bg-tertiary px-3 py-2 text-left text-sm font-medium text-text-secondary transition hover:text-text-primary"
        onClick={onOpenAvatarPicker}
      >
        <span>cambiar avatar</span>
        <span aria-hidden="true">→</span>
      </button>
      <label className="flex items-center justify-between gap-3 rounded-md bg-bg-tertiary px-3 py-2.5 text-sm text-text-secondary">
        <span>perfil público</span>
        <input
          type="checkbox"
          className="accent-accent"
          checked={publicProfile}
          onChange={(e) => setPublicProfile(e.target.checked)}
          aria-describedby="public-profile-hint"
        />
      </label>
      <p id="public-profile-hint" className="text-xs text-text-tertiary">
        Con perfil público podés compartir apuestas en social. Los montos nunca se muestran.
      </p>
      <div className="rounded-md bg-bg-tertiary px-3 py-2.5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">idioma</p>
        <div className="flex gap-2">
          {(
            [
              ['es', 'Español'],
              ['en', 'English'],
              ['pt', 'Português'],
            ] as const
          ).map(([code, label]) => (
            <button
              key={code}
              type="button"
              className={`flex-1 rounded-md border px-2 py-1.5 text-center text-xs font-medium transition ${
                locale === code
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
              }`}
              onClick={() => setLocale(code)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

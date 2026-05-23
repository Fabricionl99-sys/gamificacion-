import { useEffect, useState } from 'react';

import { Card } from '../ui/Card';

const THEME_KEY = 'wingoat_theme';
const SOUNDS_KEY = 'wingoat_reward_sounds';

function applyThemeClass(mode: 'dark' | 'light') {
  const root = document.documentElement;
  if (mode === 'light') root.classList.remove('dark');
  else root.classList.add('dark');
}

export function AppearanceSection() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark',
  );
  const [sounds, setSounds] = useState(() => (typeof localStorage === 'undefined' ? true : localStorage.getItem(SOUNDS_KEY) !== '0'));

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <Card className="space-y-3">
      <h2 className="text-md font-semibold text-text-primary">apariencia</h2>
      <div className="rounded-md bg-bg-tertiary px-3 py-2.5">
        <p className="mb-2 text-metadata font-medium uppercase tracking-wide text-text-tertiary">tema</p>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 rounded-md border px-2 py-1.5 text-center text-metadata font-medium transition ${
              theme === 'dark'
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
            }`}
            onClick={() => setTheme('dark')}
          >
            oscuro
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md border px-2 py-1.5 text-center text-metadata font-medium transition ${
              theme === 'light'
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
            }`}
            onClick={() => setTheme('light')}
          >
            claro
          </button>
        </div>
      </div>
      <label className="flex items-center justify-between rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
        sonidos de recompensas
        <input
          type="checkbox"
          className="accent-accent"
          checked={sounds}
          onChange={(e) => {
            const on = e.target.checked;
            setSounds(on);
            localStorage.setItem(SOUNDS_KEY, on ? '1' : '0');
          }}
        />
      </label>
    </Card>
  );
}

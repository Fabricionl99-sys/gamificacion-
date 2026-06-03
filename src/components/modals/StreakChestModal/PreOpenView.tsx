import { Sparkles } from 'lucide-react';

import { FuturisticChest } from '../../chest/FuturisticChest';
import { Button } from '../../ui/Button';
import { resolveChestVisualStyle } from '../../../lib/chestDesigns';

interface PreOpenViewProps {
  title: string;
  description: string;
  visualStyle?: string | null;
  loading?: boolean;
  onOpen: () => void;
}

export function PreOpenView({ title, description, visualStyle, loading, onOpen }: PreOpenViewProps) {
  const style = resolveChestVisualStyle(visualStyle);

  return (
    <div className="space-y-5 text-center">
      <div className="relative overflow-hidden rounded-2xl border border-border-default bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_55%),var(--bg-secondary)] px-4 pb-5 pt-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full blur-3xl opacity-40" style={{ background: 'var(--accent-subtle)' }} />
        <FuturisticChest style={style} phase="closed" className="mx-auto min-h-[210px] w-full max-w-[260px]" />
        <h3 className="mt-1 text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      <Button
        variant="primary"
        className="w-full"
        isLoading={loading}
        onClick={onOpen}
        leftIcon={<Sparkles className="h-4 w-4" />}
      >
        abrir cofre
      </Button>
    </div>
  );
}

import { Sparkles } from 'lucide-react';

import { FuturisticChest } from '../../chest/FuturisticChest';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
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
    <div className="space-y-4 text-center">
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_top,var(--accent-glow),var(--bg-secondary))]">
        <FuturisticChest style={style} phase="closed" className="min-h-[200px]" />
        <h3 className="mt-2 text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </Card>
      <Button
        variant="primary"
        className="w-full"
        loading={loading}
        onClick={onOpen}
        leftIcon={<Sparkles className="h-4 w-4" />}
      >
        abrir cofre
      </Button>
    </div>
  );
}

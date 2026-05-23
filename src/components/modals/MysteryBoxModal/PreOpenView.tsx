import { Gift } from 'lucide-react';

import { useShopStore } from '../../../store/shopStore';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

const defaultRewards = ['XP bonus', 'free spins', 'monedas', 'multiplicador x2'];

interface PreOpenViewProps {
  onOpen: () => void;
}

export function PreOpenView({ onOpen }: PreOpenViewProps) {
  const selectedItem = useShopStore((state) => state.selectedItem);
  const title = selectedItem?.name ?? 'Caja misteriosa premium';
  const imageUrl = selectedItem?.imageUrl;

  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl border border-accent/40 bg-[radial-gradient(circle_at_30%_20%,rgba(10,247,132,0.35),rgba(15,23,42,0.95))] shadow-glow">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-90" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Gift className="h-16 w-16 text-accent" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(300deg,transparent,rgba(10,247,132,0.18),transparent)]" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-sm text-text-secondary">ruleta horizontal estilo casino · el premio ya lo definió el server</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {defaultRewards.map((reward) => (
          <Badge key={reward} variant="neutral">
            {reward}
          </Badge>
        ))}
      </div>
      <Button variant="primary" className="w-full" onClick={onOpen}>
        abrir caja
      </Button>
    </div>
  );
}

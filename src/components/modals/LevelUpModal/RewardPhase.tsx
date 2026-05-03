import { Gift, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';

const rewards = [
  { label: '+300 XP', icon: Zap },
  { label: '+250 monedas', icon: Sparkles },
  { label: 'Caja premium', icon: Gift },
];

interface RewardPhaseProps {
  onCollect: () => void;
}

export function RewardPhase({ onCollect }: RewardPhaseProps) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-lg font-semibold text-text-primary">recompensas desbloqueadas</p>
      <div className="grid grid-cols-3 gap-2">
        {rewards.map((reward, index) => {
          const Icon = reward.icon;
          return (
            <motion.div
              key={reward.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.16 }}
              className="rounded-lg border border-border-default bg-bg-tertiary p-3"
            >
              <Icon className="mx-auto mb-2 h-5 w-5 text-accent" />
              <p className="text-xs font-semibold text-text-primary">{reward.label}</p>
            </motion.div>
          );
        })}
      </div>
      <Button variant="primary" className="w-full" onClick={onCollect}>
        apreta para recoger
      </Button>
    </div>
  );
}

import { useMemo, useState } from 'react';

import { spinWheelInventoryItem } from '../../../api/wheels';
import type { WheelSegmentDisplay, WheelVisualConfig } from '../../../lib/wheelDisplay';
import { useModalsStore } from '../../../store/modalsStore';
import { useRewardsInventoryStore } from '../../../store/rewardsInventoryStore';
import { Modal } from '../../ui/Modal';
import { PreSpinView } from './PreSpinView';
import { ResultView } from './ResultView';
import { SpinningView } from './SpinningView';

type Phase = 'pre' | 'spin' | 'result';

const DEFAULT_SEGMENTS: WheelSegmentDisplay[] = [
  { name: 'Premio 1', color: 'rgba(10, 247, 132, 0.55)' },
  { name: 'Premio 2', color: 'rgba(30, 37, 47, 0.95)' },
  { name: 'Premio 3', color: 'rgba(255, 176, 32, 0.45)' },
  { name: 'Premio 4', color: 'rgba(77, 159, 255, 0.4)' },
];

export default function WheelModal() {
  const { activeModal, closeModal } = useModalsStore();
  const selectedWheel = useRewardsInventoryStore((s) => s.selectedWheel);
  const setSelectedWheel = useRewardsInventoryStore((s) => s.setSelectedWheel);
  const [phase, setPhase] = useState<Phase>('pre');
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegmentDisplay | null>(null);
  const isOpen = activeModal === 'wheel';

  const config: WheelVisualConfig = useMemo(
    () => ({
      segments: DEFAULT_SEGMENTS,
      centerLogoUrl: selectedWheel?.image_url ?? null,
    }),
    [selectedWheel?.image_url],
  );

  const handleClose = () => {
    setPhase('pre');
    setPrizeIndex(0);
    setWonPrize(null);
    setSelectedWheel(null);
    closeModal();
  };

  const startSpin = async () => {
    if (!selectedWheel?.id) {
      const idx = Math.floor(Math.random() * config.segments.length);
      setPrizeIndex(idx);
      setPhase('spin');
      return;
    }
    try {
      await spinWheelInventoryItem(selectedWheel.id);
    } catch {
      // Animación cosmética aunque falle el POST
    }
    const idx = Math.floor(Math.random() * config.segments.length);
    setPrizeIndex(idx);
    setPhase('spin');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedWheel?.name ?? selectedWheel?.title ?? 'rueda de la fortuna'}
    >
      {phase === 'pre' ? <PreSpinView config={config} onSpin={() => void startSpin()} /> : null}
      {phase === 'spin' ? (
        <SpinningView
          config={config}
          prizeIndex={prizeIndex}
          onComplete={(won) => {
            setWonPrize(won);
            setPhase('result');
          }}
        />
      ) : null}
      {phase === 'result' && wonPrize ? <ResultView prize={wonPrize} onCollect={handleClose} /> : null}
    </Modal>
  );
}

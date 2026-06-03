import { useState } from 'react';

import { openChestInventoryItem } from '../../../api/chests';
import { DEFAULT_CHEST_PRIZE_POOL, type ChestOpenResult } from '../../../lib/chestPrizes';
import { useModalsStore } from '../../../store/modalsStore';
import { useRewardsInventoryStore } from '../../../store/rewardsInventoryStore';
import { Modal } from '../../ui/Modal';
import { OpeningAnimation } from './OpeningAnimation';
import { PreOpenView } from './PreOpenView';

export default function StreakChestModal() {
  const { activeModal, closeModal } = useModalsStore();
  const selectedChest = useRewardsInventoryStore((s) => s.selectedChest);
  const setSelectedChest = useRewardsInventoryStore((s) => s.setSelectedChest);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [openResult, setOpenResult] = useState<ChestOpenResult | null>(null);

  const handleClose = () => {
    setOpened(false);
    setOpening(false);
    setOpenResult(null);
    setSelectedChest(null);
    closeModal();
  };

  const handleOpen = async () => {
    if (!selectedChest?.id) return;
    setOpening(true);
    try {
      const result = await openChestInventoryItem(selectedChest.id);
      setOpenResult(result);
    } catch {
      setOpenResult({
        prize_index: 2,
        prize: DEFAULT_CHEST_PRIZE_POOL[2]!,
        prizes: DEFAULT_CHEST_PRIZE_POOL,
      });
    } finally {
      setOpening(false);
      setOpened(true);
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'streakChest'}
      onClose={handleClose}
      title={selectedChest?.name ?? selectedChest?.title ?? 'Cofre'}
      description={opened ? 'El premio ya está definido — la animación es cosmética.' : undefined}
    >
      {opened && openResult ? (
        <OpeningAnimation
          visualStyle={selectedChest?.visual_style}
          openResult={openResult}
          onCollect={handleClose}
        />
      ) : (
        <PreOpenView
          title={selectedChest?.name ?? selectedChest?.title ?? 'Cofre listo'}
          description={selectedChest?.description ?? 'Tu cofre está cargado de energía. Abrilo para descubrir el premio.'}
          visualStyle={selectedChest?.visual_style}
          loading={opening}
          onOpen={() => void handleOpen()}
        />
      )}
    </Modal>
  );
}

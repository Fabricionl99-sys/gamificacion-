import { Trophy } from 'lucide-react';

import { mockTournaments } from '../../mocks';
import { useModalsStore } from '../../store/modalsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export default function TournamentRegisterModal() {
  const { activeModal, closeModal } = useModalsStore();
  const tournament = mockTournaments[1] ?? mockTournaments[0];

  if (!tournament) {
    return null;
  }

  return (
    <Modal isOpen={activeModal === 'tournamentRegister'} onClose={closeModal} title="confirmar inscripcion">
      <div className="space-y-4">
        <div className="rounded-lg border border-coins/30 bg-coins/10 p-4">
          <Trophy className="mb-3 h-7 w-7 text-coins" />
          <h3 className="text-lg font-semibold">{tournament.name}</h3>
          <p className="mt-1 text-sm text-text-secondary">{tournament.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-metadata text-text-secondary">
            <span>{tournament.prizePool}<br />premio</span>
            <span>{tournament.participants}<br />inscritos</span>
            <span>{tournament.startsIn}<br />inicio</span>
          </div>
        </div>
        <p className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
          Las reglas se bloquean al confirmar. La posicion depende de XP generado durante la ventana del torneo.
        </p>
        <Button variant="primary" className="w-full" onClick={closeModal}>
          confirmar inscripcion
        </Button>
      </div>
    </Modal>
  );
}

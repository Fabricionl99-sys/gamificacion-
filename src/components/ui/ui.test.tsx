import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../test/render';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import { Pill } from './Pill';
import { ProgressBar } from './ProgressBar';
import { Skeleton } from './Skeleton';
import { Tabs } from './Tabs';
import { Toast } from './Toast';

describe('ui primitives', () => {
  it('renders core display components', () => {
    renderWithProviders(
      <div>
        <Avatar initials="JM" label="Juan Martinez" />
        <Badge>nuevo</Badge>
        <Card>card content</Card>
        <Pill label="12" />
        <ProgressBar value={50} ariaLabel="xp" />
        <Skeleton className="h-4" />
      </div>,
    );

    expect(screen.getByLabelText('Juan Martinez')).toBeInTheDocument();
    expect(screen.getByText('nuevo')).toBeInTheDocument();
    expect(screen.getByText('card content')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'xp' })).toBeInTheDocument();
  });

  it('handles button clicks and tab changes', async () => {
    const user = userEvent.setup();
    const onButtonClick = vi.fn();
    const onTabChange = vi.fn();

    renderWithProviders(
      <div>
        <Button onClick={onButtonClick}>accion</Button>
        <Tabs
          tabs={[
            { id: 'a', label: 'uno' },
            { id: 'b', label: 'dos' },
          ]}
          activeTab="a"
          onChange={onTabChange}
        />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'accion' }));
    await user.click(screen.getByRole('tab', { name: 'dos' }));

    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith('b');
  });

  it('supports modal close through Escape and close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <Modal isOpen title="modal prueba" onClose={onClose}>
        contenido modal
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'modal prueba' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'cerrar modal' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders empty states and toasts with live regions', () => {
    renderWithProviders(
      <div>
        <EmptyState icon={<span aria-hidden="true">i</span>} title="sin contenido" description="mensaje secundario" />
        <Toast message="guardado" tone="success" />
      </div>,
    );

    expect(screen.getByText('sin contenido')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('guardado');
  });
});

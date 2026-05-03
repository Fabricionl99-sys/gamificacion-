import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';

interface ScratchCanvasProps {
  onComplete: () => void;
}

export function ScratchCanvas({ onComplete }: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#FFB020';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#0A0E13';
    context.font = '600 18px Urbanist';
    context.textAlign = 'center';
    context.fillText('RASCAR', canvas.width / 2, canvas.height / 2 + 6);
  }, []);

  const scratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const context = canvas.getContext('2d');
      if (!context) return;
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(clientX - rect.left, clientY - rect.top, 18, 0, Math.PI * 2);
      context.fill();
      const nextProgress = Math.min(100, progress + 12);
      setProgress(nextProgress);
      if (nextProgress >= 72) onComplete();
    },
    [onComplete, progress],
  );

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={320}
        height={120}
        className="h-[120px] w-full rounded-lg border border-warning/40 bg-bg-tertiary touch-none"
        onPointerMove={(event) => {
          if (event.buttons === 1) scratch(event.clientX, event.clientY);
        }}
        onPointerDown={(event) => scratch(event.clientX, event.clientY)}
        aria-label="Raspa la tarjeta para revelar el premio"
      />
      <div className="text-center text-sm text-text-secondary">{progress}% revelado</div>
      <Button className="w-full" variant="primary" onClick={onComplete}>
        revelar completo
      </Button>
    </div>
  );
}

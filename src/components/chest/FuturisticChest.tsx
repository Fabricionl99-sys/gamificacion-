import { motion } from 'framer-motion';

import { getChestDesign, type ChestVisualStyle } from '../../lib/chestDesigns';
import type { ChestOpenPhase } from '../../lib/chestAnimation';

interface FuturisticChestProps {
  style: ChestVisualStyle;
  phase: ChestOpenPhase;
  className?: string;
  /** Tamaño compacto para listas / cards */
  compact?: boolean;
}

function CrystalFacets({ x, y, w, h, top, bottom, stroke }: {
  x: number; y: number; w: number; h: number;
  top: string; bottom: string; stroke: string;
}) {
  const mid = x + w / 2;
  return (
    <g>
      <defs>
        <linearGradient id={`cg-${x}-${y}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <path
        d={`M${x} ${y} L${mid} ${y + h * 0.12} L${x + w} ${y} L${x + w} ${y + h} L${mid} ${y + h * 0.88} L${x} ${y + h} Z`}
        fill={`url(#cg-${x}-${y})`}
        stroke={stroke}
        strokeWidth="0.6"
        opacity="0.95"
      />
      <path
        d={`M${mid} ${y + h * 0.12} L${x + w} ${y} L${x + w} ${y + h} L${mid} ${y + h * 0.88} Z`}
        fill="white"
        opacity="0.08"
      />
    </g>
  );
}

function WoodPanel({ x, y, w, h, top, bottom, grain, stroke }: {
  x: number; y: number; w: number; h: number;
  top: string; bottom: string; grain: string; stroke: string;
}) {
  return (
    <g>
      <defs>
        <linearGradient id={`wg-${x}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={`url(#wg-${x})`} stroke={stroke} strokeWidth="0.8" />
      {[0.25, 0.5, 0.75].map((p) => (
        <path
          key={p}
          d={`M${x + 2} ${y + h * p} Q${x + w / 2} ${y + h * p + 2} ${x + w - 2} ${y + h * p}`}
          stroke={grain}
          strokeWidth="0.5"
          fill="none"
          opacity="0.35"
        />
      ))}
    </g>
  );
}

function GoldBand({ d, frame, highlight }: { d: string; frame: string; highlight: string }) {
  return (
    <>
      <path d={d} fill={frame} stroke={highlight} strokeWidth="0.5" />
      <path d={d} fill="url(#goldSheen)" opacity="0.35" />
    </>
  );
}

function Diamond({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <polygon
      points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
      fill={fill}
      stroke="white"
      strokeWidth="0.3"
      opacity="0.95"
    />
  );
}

export function FuturisticChest({ style, phase, className = '', compact = false }: FuturisticChestProps) {
  const design = getChestDesign(style);
  const shaking = phase === 'shake';
  const lockBreaking = phase === 'lockBreak';
  const lidOpen = phase === 'open' || phase === 'ready' || phase === 'spinning' || phase === 'result';
  const showLock = phase === 'closed' || phase === 'shake' || phase === 'lockBreak';
  const showInnerGlow = lidOpen || phase === 'lockBreak';

  const size = compact ? 'h-[88px] w-[110px]' : 'h-[200px] w-[240px]';

  const Panel = design.panelMode === 'wood' ? (
    <WoodPanel x={52} y={88} w={96} h={52} top={design.panelTop} bottom={design.panelBottom} grain={design.woodGrain ?? design.panelBottom} stroke={design.panelStroke} />
  ) : (
    <CrystalFacets x={52} y={88} w={96} h={52} top={design.panelTop} bottom={design.panelBottom} stroke={design.panelStroke} />
  );

  const LidPanel = design.panelMode === 'wood' ? (
    <WoodPanel x={48} y={38} w={104} h={36} top={design.panelTop} bottom={design.panelBottom} grain={design.woodGrain ?? design.panelBottom} stroke={design.panelStroke} />
  ) : (
    <CrystalFacets x={48} y={38} w={104} h={36} top={design.panelTop} bottom={design.panelBottom} stroke={design.panelStroke} />
  );

  return (
    <div className={`relative grid place-items-center ${size} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: design.glow }}
        animate={{
          opacity: showInnerGlow ? [0.4, 0.85, 0.5] : shaking ? [0.25, 0.55, 0.3] : 0.2,
          scale: showInnerGlow ? [0.9, 1.15, 1] : 0.85,
        }}
        transition={{ duration: 0.55, repeat: shaking ? Infinity : 0, repeatType: 'reverse' }}
      />

      <motion.div
        className="relative"
        animate={
          shaking
            ? { x: [0, -6, 6, -5, 5, -3, 3, 0], rotate: [0, -1, 1, 0] }
            : { x: 0, rotate: 0 }
        }
        transition={shaking ? { duration: 0.1, repeat: Infinity, repeatType: 'mirror' } : { duration: 0.2 }}
      >
        <svg viewBox="0 0 200 180" className="h-full w-full drop-shadow-2xl" aria-hidden="true">
          <defs>
            <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.55" />
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.25" />
            </linearGradient>
            <filter id="chestGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="innerLight" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor={design.glowStrong} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Sombra en el suelo */}
          <ellipse cx="100" cy="168" rx="62" ry="8" fill="black" opacity="0.35" />

          {/* Base — cuerpo */}
          <rect x="44" y="82" width="112" height="62" rx="4" fill={design.frameShadow} />
          <rect x="46" y="84" width="108" height="58" rx="3" fill={design.frame} stroke={design.frameHighlight} strokeWidth="0.8" />

          {Panel}

          {/* Bandas verticales doradas */}
          <GoldBand d="M58 84 L66 84 L66 142 L58 142 Z" frame={design.frameHighlight} highlight={design.frame} />
          <GoldBand d="M96 84 L104 84 L104 142 L96 142 Z" frame={design.frameHighlight} highlight={design.frame} />
          <GoldBand d="M134 84 L142 84 L142 142 L134 142 Z" frame={design.frameHighlight} highlight={design.frame} />

          {/* Esquinas con diamantes */}
          <Diamond cx={50} cy={88} r={3} fill="#F8FAFC" />
          <Diamond cx={150} cy={88} r={3} fill="#F8FAFC" />
          <Diamond cx={50} cy={138} r={3} fill="#F8FAFC" />
          <Diamond cx={150} cy={138} r={3} fill="#F8FAFC" />

          {/* Brillo interno al abrir */}
          {showInnerGlow ? (
            <ellipse cx="100" cy="120" rx="38" ry="18" fill="url(#innerLight)" filter="url(#chestGlow)" />
          ) : null}

          {/* Tapa — animada */}
          <motion.g
            style={{ transformOrigin: '48px 82px' }}
            animate={{ rotate: lidOpen ? -58 : 0 }}
            transition={{ duration: 0.65, ease: [0.34, 1.45, 0.64, 1] }}
          >
            <g>
              <path d="M42 78 Q100 28 158 78 L158 86 Q100 36 42 86 Z" fill={design.frameShadow} />
              <path d="M44 76 Q100 30 156 76 L156 84 Q100 38 44 84 Z" fill={design.frame} stroke={design.frameHighlight} strokeWidth="0.8" />
              {LidPanel}
              <GoldBand d="M56 76 L64 76 L62 84 L54 84 Z" frame={design.frameHighlight} highlight={design.frame} />
              <GoldBand d="M96 58 L104 58 L104 84 L96 84 Z" frame={design.frameHighlight} highlight={design.frame} />
              <GoldBand d="M136 76 L144 76 L146 84 L138 84 Z" frame={design.frameHighlight} highlight={design.frame} />
              {/* Gema central en la tapa */}
              <polygon
                points="100,34 108,42 100,50 92,42"
                fill={design.panelTop}
                stroke={design.frameHighlight}
                strokeWidth="0.6"
                filter="url(#chestGlow)"
              />
            </g>
          </motion.g>

          {/* Candado central */}
          {showLock ? (
            <motion.g
              animate={
                lockBreaking
                  ? { scale: [1, 1.15, 0], rotate: [0, -12, 18], opacity: [1, 1, 0], y: [0, -4, 10] }
                  : { scale: shaking ? [1, 1.05, 1] : 1, opacity: 1, y: 0 }
              }
              transition={{ duration: lockBreaking ? 0.38 : 0.15, repeat: shaking && !lockBreaking ? Infinity : 0 }}
              style={{ transformOrigin: '100px 78px' }}
            >
              <rect x="88" y="68" width="24" height="20" rx="3" fill={design.frameShadow} stroke={design.frameHighlight} strokeWidth="0.6" />
              <circle cx="100" cy="78" r="9" fill={design.lockRing} stroke={design.frameHighlight} strokeWidth="0.5" />
              <circle cx="100" cy="78" r="5.5" fill={design.lockGem} filter="url(#chestGlow)" />
              <path d="M94 68 Q100 58 106 68" fill="none" stroke={design.frameHighlight} strokeWidth="2.5" strokeLinecap="round" />
              <Diamond cx={100} cy={68} r={2} fill="#FFF" />
            </motion.g>
          ) : null}
        </svg>
      </motion.div>

      {!compact ? (
        <p className="absolute -bottom-1 text-[10px] font-medium uppercase tracking-[0.2em] text-text-tertiary/80">
          {design.label}
        </p>
      ) : null}
    </div>
  );
}

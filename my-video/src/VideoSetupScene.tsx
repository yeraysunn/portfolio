import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT_FAMILY} from './fonts';

/* ── palette ─────────────────────────────────────────── */
const BG = '#0e0d0c';
const GREEN = '#588157';

/* ── float params ────────────────────────────────────── */
/** Duration of one full float cycle in frames (2.6 s @ 30 fps) */
const FLOAT_PERIOD = 78;
/** Peak displacement in px (goes up by this amount at mid-cycle) */
const FLOAT_AMP = 8;

/* ── token descriptor ────────────────────────────────── */
interface TokenDef {
  label: string;
  /** Frame at which the slide-up entry begins */
  entryDelay: number;
  /** Frame at which the continuous float begins */
  floatDelay: number;
  /** Renders as the dim connecting dash */
  isDash?: boolean;
}

/**
 * Stagger mirrors the CSS animation-delay values from the reference design:
 *   token 1  → 0.20 s entry / 0.92 s float
 *   dash     → 0.55 s entry / 1.27 s float
 *   token 2  → 0.90 s entry / 1.62 s float
 */
const TOKENS: TokenDef[] = [
  {label: '5s',  entryDelay: 6,  floatDelay: 28},
  {label: '–',   entryDelay: 17, floatDelay: 38, isDash: true},
  {label: '10s', entryDelay: 27, floatDelay: 49},
];

/* ── single animated token ───────────────────────────── */
interface TokenProps extends TokenDef {
  frame: number;
  fps: number;
  /** Base px width of the composition (used for relative sizing) */
  width: number;
}

const Token: React.FC<TokenProps> = ({
  label,
  entryDelay,
  floatDelay,
  isDash,
  frame,
  fps,
  width,
}) => {
  /* slide-up entry ------------------------------------------------ */
  const localFrame = frame - entryDelay;

  const sp = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: {
      // cubic-bezier(0.16, 1, 0.3, 1) – spring approximation
      damping: 14,
      mass: 0.8,
      stiffness: 90,
    },
    from: 0,
    to: 1,
  });

  const entryProgress = localFrame < 0 ? 0 : sp;
  const slideY = interpolate(entryProgress, [0, 1], [40, 0]);

  /* continuous float (cosine wave starting at 0) ------------------- */
  const floatFrame = frame - floatDelay;
  const floatY =
    floatFrame > 0
      ? -(FLOAT_AMP / 2) * (1 - Math.cos((2 * Math.PI * floatFrame) / FLOAT_PERIOD))
      : 0;

  /* typography ----------------------------------------------------- */
  const u = width / 1080; // scale factor relative to reference width
  const fontSize = isDash ? u * 56 : u * 76;
  const fontWeight = isDash ? 400 : 700;
  const opacity = entryProgress * (isDash ? 0.45 : 1);

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color: GREEN,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        opacity,
        transform: `translateY(${slideY + floatY}px)`,
        // GPU-composited — keeps renders smooth
        willChange: 'transform, opacity',
      }}
    >
      {label}
    </span>
  );
};

/* ── scene ───────────────────────────────────────────── */
export const VideoSetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.round(width * 0.009), // ≈ 10 px at 1080
      }}
    >
      {TOKENS.map((t) => (
        <Token key={t.label} {...t} frame={frame} fps={fps} width={width} />
      ))}
    </AbsoluteFill>
  );
};
